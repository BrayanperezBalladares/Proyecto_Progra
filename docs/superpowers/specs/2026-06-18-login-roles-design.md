# Login y Roles — Diseño

**Fecha:** 2026-06-18  
**Proyecto:** Restaurante Progra (frontend React + backend .NET + Supabase PostgreSQL)  
**Estado:** Aprobado

---

## Resumen

Implementar autenticación y control de acceso por roles usando **Supabase Auth** como proveedor de identidad. El backend .NET valida los JWTs emitidos por Supabase. Se soporta login con email/password y Google OAuth.

---

## 1. Arquitectura

```
Cliente/Browser
    │
    ├─ Supabase JS SDK  ──────►  Supabase Auth
    │   (login/register)          (emite JWT con role en app_metadata)
    │
    └─ axios + JWT  ──────────►  .NET Backend
                                   │
                                   ├─ valida JWT (Supabase JWT secret)
                                   ├─ extrae rol via SupabaseRoleClaimsTransformer
                                   └─ PostgreSQL (Supabase DB)
```

**Flujo de login:**
1. Usuario ingresa email/password (o usa Google OAuth) en `/login`
2. Supabase JS valida y devuelve un JWT; la sesión se persiste automáticamente
3. Cada request al backend lleva `Authorization: Bearer <jwt>`
4. El backend verifica la firma con el JWT secret de Supabase y extrae el rol

**Registro de clientes:** Auto-registro → Supabase trigger asigna `app_metadata.role = 'cliente'` y crea row en la tabla `Users`.

**Creación de staff:** El Admin crea cuentas de Recepcionista desde la app; el backend llama a la Admin API de Supabase y asigna `app_metadata.role = 'recepcionista'`.

---

## 2. Roles y permisos

| Feature | Admin | Recepcionista | Cliente |
|---|---|---|---|
| Ver plano salón | ✅ | ✅ | ❌ |
| Gestionar reservas (todas) | ✅ | ✅ | ❌ |
| Ver/cancelar sus propias reservas | ✅ | ✅ | ✅ |
| Crear reserva propia | ✅ | ✅ | ✅ |
| Gestionar mesas / zonas | ✅ | ❌ | ❌ |
| Gestionar bloqueos | ✅ | ✅ | ❌ |
| Gestionar usuarios / roles | ✅ | ❌ | ❌ |
| Ver dashboard general | ✅ | ✅ | ❌ |
| Acceso a lista de espera | ✅ | ✅ | ❌ |

**Redirección post-login:**
- Admin / Recepcionista → `/dashboard`
- Cliente → `/mis-reservas`

---

## 3. Modelo de datos

### Cambio en tabla `Users`

Migración EF Core: agregar columna `supabase_uid`.

```sql
ALTER TABLE "Users" ADD COLUMN "supabase_uid" VARCHAR UNIQUE;
```

El **rol** vive en `app_metadata` de Supabase Auth (dentro del JWT). No se almacena en la tabla `Users` — el backend lo lee directo del token.

### Tipo `User` (frontend)

```ts
type User = {
  id: number
  supabaseUid: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'recepcionista' | 'cliente'  // leído del JWT
}
```

### Supabase trigger

Al registrarse un nuevo usuario, un trigger de Supabase:
1. Inserta un row en `public.Users` con `supabase_uid = NEW.id`
2. Llama a la Admin API para fijar `app_metadata.role = 'cliente'`

---

## 4. Cambios en el frontend

### Nuevos archivos

```
src/
  lib/
    supabase.ts                    -- cliente Supabase inicializado con env vars
  api/
    shared/
      hooks/
        use-auth.ts                -- hook: { user, role, isLoading, signIn, signOut, signInWithGoogle }
  ui/
    pages/
      login/
        login-page.tsx             -- formulario email/password + botón Google
      mis-reservas/
        mis-reservas-page.tsx      -- reservas del cliente autenticado (solo las suyas)
    shell/
      auth-guard/
        auth-guard.tsx             -- wrapper de rutas protegidas por rol
```

### Route guards (TanStack Router)

```ts
// beforeLoad en rutas de staff:
beforeLoad: ({ context }) => {
  if (!context.auth.user) throw redirect({ to: '/login' })
  if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' })
}

// beforeLoad en /login:
beforeLoad: ({ context }) => {
  if (context.auth.user) throw redirect({ to: '/dashboard' })
}
```

### NavBar

- Agregar avatar con nombre de usuario + botón "Cerrar sesión" al extremo derecho
- Ocultar ítems de staff (Dashboard, Plano, Mesas, Zonas, Bloqueos, Lista espera) si `role === 'cliente'`

### `auth.service.ts`

Reemplazar completamente. `useAuth()` es la única fuente de verdad de sesión. El archivo actual (localStorage hardcodeado) se elimina.

### `apiClient` (axios) — interceptor

```ts
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`
  }
  return config
})
```

### Variables de entorno nuevas (frontend)

```
VITE_SUPABASE_URL=https://mmmfeijsrhchdivgwzhm.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key de Supabase>
```

---

## 5. Cambios en el backend

### NuGet

```
Microsoft.AspNetCore.Authentication.JwtBearer
```

### `Program.cs`

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options => {
    options.Authority = "https://mmmfeijsrhchdivgwzhm.supabase.co/auth/v1";
    options.TokenValidationParameters = new TokenValidationParameters {
      ValidateIssuer = true,
      ValidIssuer = "https://mmmfeijsrhchdivgwzhm.supabase.co/auth/v1",
      ValidateAudience = false,
      IssuerSigningKey = new SymmetricSecurityKey(
        Convert.FromBase64String(Environment.GetEnvironmentVariable("SUPABASE_JWT_SECRET")!))
    };
  });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IClaimsTransformation, SupabaseRoleClaimsTransformer>();
```

### `SupabaseRoleClaimsTransformer`

Clase que implementa `IClaimsTransformation`. Lee el claim `app_metadata` del JWT (JSON), extrae el campo `role` y lo agrega como `ClaimTypes.Role` estándar de .NET.

### Decoradores en controllers

```csharp
[Authorize]                                    // requiere autenticación
[Authorize(Roles = "admin")]                   // solo admin
[Authorize(Roles = "admin,recepcionista")]     // staff interno
```

### Nuevos endpoints

| Endpoint | Rol requerido | Propósito |
|---|---|---|
| `POST /api/Auth/staff` | admin | Crea cuenta de recepcionista via Supabase Admin API |
| `GET /api/Reserva/mis-reservas` | cliente | Reservas del usuario autenticado (filtra por `supabase_uid`) |

### Migración EF Core

```
dotnet ef migrations add AddSupabaseUidToUsers
```

### Variable de entorno nueva (backend)

```
SUPABASE_JWT_SECRET=<JWT secret de Supabase Settings > API>
```
Agregar en Render (env var) y en `appsettings.Development.json` (gitignored).

---

## 6. Fuera de alcance (YAGNI)

- Refresh token manual (Supabase JS lo maneja automáticamente)
- 2FA / MFA
- Auditoría de accesos
- Recuperación de cuenta por SMS
- Roles adicionales (cocinero, caja, etc.)
