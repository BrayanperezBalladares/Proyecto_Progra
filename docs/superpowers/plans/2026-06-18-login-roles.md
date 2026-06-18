# Login y Roles — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement authentication and role-based access control using Supabase Auth as identity provider, with JWT validation in the .NET backend and route guards in the React frontend.

**Architecture:** Supabase Auth issues JWTs with `app_metadata.role` (`admin` | `recepcionista`; absent = `cliente`). The .NET backend validates these JWTs and uses a `SupabaseRoleClaimsTransformer` to map the role into ASP.NET `ClaimTypes.Role`. The React frontend uses the Supabase JS SDK for auth state and passes the JWT to the backend via an axios interceptor.

**Tech Stack:** `@supabase/supabase-js`, TanStack Router v1 (file-based), `Microsoft.AspNetCore.Authentication.JwtBearer` 10.x, EF Core 10.x, .NET 10

## Global Constraints

- Backend project: `C:\Proyecto prograII\ProyectoIProgra2`
- Frontend project: `C:\Proyecto_Progra`
- Supabase project ref: `mmmfeijsrhchdivgwzhm`
- Supabase URL: `https://mmmfeijsrhchdivgwzhm.supabase.co`
- Auth issuer: `https://mmmfeijsrhchdivgwzhm.supabase.co/auth/v1`
- Role values: `admin`, `recepcionista`, `cliente` (default when `app_metadata.role` absent)
- Never commit `appsettings.Development.json` (already gitignored)
- Never commit `.env.local` — add to `.gitignore` if not already there
- All new backend classes in namespace `ProyectoIProgra2`
- TanStack Router file-based: new routes go in `src/routes/`; run `npm run dev` to regenerate `routeTree.gen.ts`

---

## Task 1: Backend — JWT authentication setup

**Files:**
- Modify: `ProyectoIProgra2.csproj`
- Create: `Auth/SupabaseRoleClaimsTransformer.cs`
- Modify: `Program.cs`
- Modify: `appsettings.Development.json` (local only, gitignored)

**Interfaces:**
- Produces: `[Authorize]`, `[Authorize(Roles = "admin")]`, `[Authorize(Roles = "admin,recepcionista")]` work on all controllers. Unauthenticated requests return 401.

- [ ] **Step 1: Add JwtBearer NuGet package**

```bash
cd "C:\Proyecto prograII\ProyectoIProgra2"
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 10.0.*
```

Expected: package added to `.csproj`, `dotnet restore` runs automatically.

- [ ] **Step 2: Create `Auth/SupabaseRoleClaimsTransformer.cs`**

```csharp
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Text.Json;

namespace ProyectoIProgra2.Auth
{
    public class SupabaseRoleClaimsTransformer : IClaimsTransformation
    {
        public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var identity = (ClaimsIdentity)principal.Identity!;

            var appMetaRaw = identity.FindFirst("app_metadata")?.Value;
            string role = "cliente";

            if (!string.IsNullOrEmpty(appMetaRaw))
            {
                try
                {
                    var meta = JsonSerializer.Deserialize<JsonElement>(appMetaRaw);
                    if (meta.TryGetProperty("role", out var roleProp))
                        role = roleProp.GetString() ?? "cliente";
                }
                catch { /* malformed claim → default to cliente */ }
            }

            if (!identity.HasClaim(ClaimTypes.Role, role))
                identity.AddClaim(new Claim(ClaimTypes.Role, role));

            return Task.FromResult(principal);
        }
    }
}
```

- [ ] **Step 3: Update `Program.cs` — add authentication before `AddAuthorization()`**

Add this block immediately after the line `AppContext.SetSwitch(...)` and before `var builder = ...` (it must come first). Actually, place it right after `var builder = WebApplication.CreateBuilder(args);`:

```csharp
// Add at top of file
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using ProyectoIProgra2.Auth;
```

Then add this block **after** `builder.Services.AddScoped<IZonaServicio, ZonaServicio>();` and **before** `builder.Services.AddControllers(...)`:

```csharp
var supabaseJwtSecret = builder.Configuration["SUPABASE_JWT_SECRET"]
    ?? throw new InvalidOperationException("SUPABASE_JWT_SECRET is required");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://mmmfeijsrhchdivgwzhm.supabase.co/auth/v1",
            ValidateAudience = false,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Convert.FromBase64String(supabaseJwtSecret)),
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IClaimsTransformation, SupabaseRoleClaimsTransformer>();
```

Then **replace** the existing `app.UseAuthorization();` line with:

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

- [ ] **Step 4: Add `SUPABASE_JWT_SECRET` to `appsettings.Development.json`**

Open `appsettings.Development.json` (gitignored). Add the key alongside the existing connection string. The JWT secret is found in Supabase Dashboard → Settings → API → JWT Settings → JWT Secret. It is a base64-encoded string.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.mmmfeijsrhchdivgwzhm.supabase.co;Port=5432;..."
  },
  "SUPABASE_JWT_SECRET": "<paste base64 JWT secret from Supabase dashboard>"
}
```

- [ ] **Step 5: Add a temporary protected endpoint to verify 401 behavior**

Open `Controllers/WeatherForecastController.cs`, add `[Authorize]` to the class:

```csharp
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase { ... }
```

- [ ] **Step 6: Run backend and verify 401**

```bash
cd "C:\Proyecto prograII\ProyectoIProgra2"
dotnet run --launch-profile http
```

In another terminal:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5147/weatherforecast
```

Expected output: `401`

- [ ] **Step 7: Revert the temporary [Authorize] on WeatherForecastController**

Remove `[Authorize]` from `WeatherForecastController.cs` (it was just for testing).

- [ ] **Step 8: Commit**

```bash
cd "C:\Proyecto prograII\ProyectoIProgra2"
git add Auth/SupabaseRoleClaimsTransformer.cs ProyectoIProgra2.csproj Program.cs
git commit -m "feat: add Supabase JWT authentication and role claims transformer"
```

---

## Task 2: Backend — Add `SupabaseUid` to `Cliente` entity + migration

**Files:**
- Modify: `Entidades/Cliente.cs`
- Create: new EF Core migration (auto-generated)
- Modify: `Data/MyAppDbContext.cs` (if seed data references Cliente)

**Interfaces:**
- Produces: `Cliente.SupabaseUid` property (nullable string, unique). Used by Task 3 to filter reservations.

- [ ] **Step 1: Add `SupabaseUid` to `Cliente.cs`**

```csharp
namespace ProyectoIProgra2.Entidades
{
    public class Cliente
    {
        public int ClienteId { get; set; }
        public int Ced { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public int Tel { get; set; }
        public string Email { get; set; }
        public string? SupabaseUid { get; set; }
    }
}
```

- [ ] **Step 2: Create migration**

```bash
cd "C:\Proyecto prograII\ProyectoIProgra2"
dotnet ef migrations add AddSupabaseUidToCliente
```

Expected: new migration file created in `Migrations/`.

- [ ] **Step 3: Verify migration SQL looks correct**

Open the generated migration file. It should contain:
```csharp
migrationBuilder.AddColumn<string>(
    name: "SupabaseUid",
    table: "Clientes",
    type: "text",
    nullable: true);
```

Also add a unique index for `SupabaseUid`. If it's not there, add it manually to the migration:
```csharp
migrationBuilder.CreateIndex(
    name: "IX_Clientes_SupabaseUid",
    table: "Clientes",
    column: "SupabaseUid",
    unique: true,
    filter: "\"SupabaseUid\" IS NOT NULL");
```

And the Down:
```csharp
migrationBuilder.DropIndex(name: "IX_Clientes_SupabaseUid", table: "Clientes");
migrationBuilder.DropColumn(name: "SupabaseUid", table: "Clientes");
```

- [ ] **Step 4: Run backend to apply migration**

```bash
dotnet run --launch-profile http
```

On startup, `dbContext.Database.Migrate()` runs automatically. Check logs for `Applying migration 'AddSupabaseUidToCliente'`.

- [ ] **Step 5: Commit**

```bash
git add Entidades/Cliente.cs Migrations/
git commit -m "feat: add SupabaseUid to Cliente entity"
```

---

## Task 3: Backend — AuthController + mis-reservas endpoint

**Files:**
- Create: `Controllers/AuthController.cs`
- Modify: `Controllers/ReservaController.cs`
- Modify: `Servicios/Interfaces/IReservaServicio.cs`
- Modify: `Servicios/ReservaServicio.cs`
- Modify: `Data/MyAppDbContext.cs` (to access Clientes in ReservaServicio)

**Interfaces:**
- Consumes: `SupabaseRoleClaimsTransformer` from Task 1, `Cliente.SupabaseUid` from Task 2
- Produces:
  - `POST /api/Auth/staff` — `[Authorize(Roles = "admin")]` — body: `{ email, password, nombre }` — creates recepcionista via Supabase Admin API
  - `GET /api/Reserva/mis-reservas` — `[Authorize]` — returns `List<ReservaDto>` for authenticated client

- [ ] **Step 1: Create `Controllers/AuthController.cs`**

This controller creates staff accounts by calling the Supabase Admin API. It requires `SUPABASE_SERVICE_ROLE_KEY` in configuration.

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ProyectoIProgra2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthController(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        // POST: api/Auth/staff
        [HttpPost("staff")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CrearStaff([FromBody] CreateStaffDto dto)
        {
            var serviceKey = _config["SUPABASE_SERVICE_ROLE_KEY"]
                ?? throw new InvalidOperationException("SUPABASE_SERVICE_ROLE_KEY is required");

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", serviceKey);
            client.DefaultRequestHeaders.Add("apikey", serviceKey);

            var body = JsonSerializer.Serialize(new
            {
                email = dto.Email,
                password = dto.Password,
                email_confirm = true,
                app_metadata = new { role = "recepcionista" }
            });

            var response = await client.PostAsync(
                "https://mmmfeijsrhchdivgwzhm.supabase.co/auth/v1/admin/users",
                new StringContent(body, Encoding.UTF8, "application/json"));

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(error);
            }

            return Ok(new { message = "Staff account created", email = dto.Email });
        }
    }

    public class CreateStaffDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
```

- [ ] **Step 2: Register `IHttpClientFactory` in `Program.cs`**

Add this line after `builder.Services.AddAuthorization();`:

```csharp
builder.Services.AddHttpClient();
```

- [ ] **Step 3: Add `SUPABASE_SERVICE_ROLE_KEY` to `appsettings.Development.json`**

Find it in Supabase Dashboard → Settings → API → Service Role Key (secret, keep it safe).

```json
{
  "ConnectionStrings": { "DefaultConnection": "..." },
  "SUPABASE_JWT_SECRET": "...",
  "SUPABASE_SERVICE_ROLE_KEY": "<paste service role key>"
}
```

- [ ] **Step 4: Add `ObtenerPorSupabaseUid` to `IReservaServicio`**

Open `Servicios/Interfaces/IReservaServicio.cs` and add:

```csharp
List<ReservaDto> ObtenerPorClienteSupabaseUid(string supabaseUid, string email);
```

- [ ] **Step 5: Implement `ObtenerPorClienteSupabaseUid` in `ReservaServicio.cs`**

Open `Servicios/ReservaServicio.cs`. The service needs access to both `Reservas` and `Clientes`. Inject `MyAppDbContext` if not already injected (check the constructor). Then add:

```csharp
public List<ReservaDto> ObtenerPorClienteSupabaseUid(string supabaseUid, string email)
{
    // Auto-link by email if SupabaseUid not yet set
    var cliente = _context.Clientes
        .FirstOrDefault(c => c.SupabaseUid == supabaseUid);

    if (cliente == null && !string.IsNullOrEmpty(email))
    {
        cliente = _context.Clientes
            .FirstOrDefault(c => c.Email == email && c.SupabaseUid == null);

        if (cliente != null)
        {
            cliente.SupabaseUid = supabaseUid;
            _context.SaveChanges();
        }
    }

    if (cliente == null) return [];

    return _context.Reservas
        .Where(r => r.ClienteId == cliente.ClienteId)
        .Select(r => new ReservaDto
        {
            ReservaId = r.ReservaId,
            TurnoId = r.TurnoId,
            EstadoDeReservaId = r.EstadoDeReservaId,
            CantidaPersonas = r.CantidaPersonas,
            HoraInicio = r.HoraInicio,
            HoraFin = r.HoraFin,
            Fecha = r.Fecha,
            ClienteId = r.ClienteId,
            MesaId = r.MesaId
        })
        .ToList();
}
```

> Note: If `ReservaServicio` doesn't have `_context` injected (it may use a repository pattern), adapt accordingly — inject `MyAppDbContext` via the constructor.

- [ ] **Step 6: Add `GET /api/Reserva/mis-reservas` to `ReservaController.cs`**

Add these usings at the top:
```csharp
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
```

Add this endpoint to the controller:

```csharp
// GET: api/reserva/mis-reservas
[HttpGet("mis-reservas")]
[Authorize]
public ActionResult<List<ReservaDto>> MisReservas()
{
    var supabaseUid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        ?? User.FindFirst("sub")?.Value;
    var email = User.FindFirst(ClaimTypes.Email)?.Value
        ?? User.FindFirst("email")?.Value;

    if (string.IsNullOrEmpty(supabaseUid))
        return Unauthorized();

    var reservas = _reservaServicio.ObtenerPorClienteSupabaseUid(supabaseUid, email ?? "");
    return Ok(reservas);
}
```

- [ ] **Step 7: Verify `ReservaServicio` has `MyAppDbContext` available**

Open `Servicios/ReservaServicio.cs` and check the constructor. If it uses `MyAppDbContext`, great. If not, add it:

```csharp
private readonly MyAppDbContext _context;

public ReservaServicio(MyAppDbContext context)
{
    _context = context;
}
```

Also ensure `_context.Reservas` and `_context.Clientes` are available — check `Data/MyAppDbContext.cs` for `DbSet<Reserva>` and `DbSet<Cliente>`.

- [ ] **Step 8: Build and run backend**

```bash
dotnet build
dotnet run --launch-profile http
```

Expected: no build errors.

- [ ] **Step 9: Commit**

```bash
git add Controllers/AuthController.cs Controllers/ReservaController.cs Servicios/ Program.cs
git commit -m "feat: add AuthController and mis-reservas endpoint"
```

---

## Task 4: Frontend — Supabase client + useAuth hook

**Files:**
- Modify: `package.json` (install @supabase/supabase-js)
- Create: `src/lib/supabase.ts`
- Create: `src/api/shared/hooks/use-auth.ts`
- Modify: `.env` (add Supabase vars)

**Interfaces:**
- Produces: `useAuth()` hook returning `{ user: AuthUser | null, role: Role, isLoading: boolean, signIn, signOut, signInWithGoogle }`
- Produces: `supabase` client singleton from `src/lib/supabase.ts`

Types used in this task:
```ts
type Role = 'admin' | 'recepcionista' | 'cliente'

type AuthUser = {
  id: string           // Supabase UID
  email: string
  name: string
  role: Role
}
```

- [ ] **Step 1: Install @supabase/supabase-js**

```bash
cd "C:\Proyecto_Progra"
npm install @supabase/supabase-js
```

Expected: package added to `package.json` and `node_modules`.

- [ ] **Step 2: Add Supabase vars to `.env`**

Open `C:\Proyecto_Progra\.env` and add:

```
VITE_SUPABASE_URL=https://mmmfeijsrhchdivgwzhm.supabase.co
VITE_SUPABASE_ANON_KEY=<paste anon key from Supabase Dashboard → Settings → API → Project API keys → anon/public>
```

Also add `.env.local` to `.gitignore` if it's not already there (for local overrides).

- [ ] **Step 3: Create `src/lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 4: Create `src/api/shared/hooks/use-auth.ts`**

```ts
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type Role = 'admin' | 'recepcionista' | 'cliente'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: Role
}

function extractRole(session: Session): Role {
  const role = session.user.app_metadata?.role
  if (role === 'admin' || role === 'recepcionista') return role
  return 'cliente'
}

function sessionToAuthUser(session: Session): AuthUser {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.user_metadata?.full_name ?? session.user.email ?? '',
    role: extractRole(session),
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? sessionToAuthUser(data.session) : null)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? sessionToAuthUser(session) : null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password })

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })

  const signOut = () => supabase.auth.signOut()

  return {
    user,
    role: user?.role ?? 'cliente',
    isLoading,
    signIn,
    signOut,
    signInWithGoogle,
  }
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd "C:\Proyecto_Progra"
npx tsc --noEmit
```

Expected: no errors related to the new files.

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabase.ts src/api/shared/hooks/use-auth.ts .env package.json package-lock.json
git commit -m "feat: add Supabase client and useAuth hook"
```

---

## Task 5: Frontend — Update axios interceptor

**Files:**
- Modify: `src/api/client/axios-instance.ts`
- Delete: `src/api/shared/services/auth.service.ts` (replaced by useAuth)
- Delete: `src/api/shared/hooks/use-session.ts` (replaced by useAuth)

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase.ts`
- Produces: `apiClient` sends `Authorization: Bearer <supabase-jwt>` on every request

- [ ] **Step 1: Check where `auth.service.ts` and `use-session.ts` are imported**

```bash
cd "C:\Proyecto_Progra"
grep -r "auth.service\|use-session" src/ --include="*.ts" --include="*.tsx" -l
```

Note the files found. If any file other than the ones being deleted imports these, update those imports to use `useAuth` instead (or simply remove the import if it was only for session state).

- [ ] **Step 2: Update `src/api/client/axios-instance.ts`**

Replace the entire request interceptor with one that reads the Supabase session asynchronously:

```ts
import axios, { type AxiosError } from 'axios'
import type { ApiError } from './api-error'
import { getApiBaseUrl } from '@api/config'
import { supabase } from '@/lib/supabase'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
})

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; title?: string }>) => {
    const data = error.response?.data
    const message =
      (typeof data === 'string' ? data : null) ??
      data?.message ??
      data?.title ??
      error.message ??
      'No se pudo conectar con el API. Verifica que ProyectoIProgra2 esté en ejecución.'

    const apiError: ApiError = {
      message,
      status: error.response?.status,
      code: error.code,
    }
    return Promise.reject(apiError)
  },
)
```

- [ ] **Step 3: Delete `auth.service.ts` and `use-session.ts`**

```bash
rm "C:\Proyecto_Progra\src\api\shared\services\auth.service.ts"
rm "C:\Proyecto_Progra\src\api\shared\hooks\use-session.ts"
```

- [ ] **Step 4: Fix any broken imports from Step 1**

For each file found in Step 1, remove the import of `auth.service` or `use-session`. Replace any usage of `useSession()` / `getStoredSession()` with `useAuth()` from `@api/shared/hooks/use-auth`.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/api/client/axios-instance.ts
git rm src/api/shared/services/auth.service.ts src/api/shared/hooks/use-session.ts
git commit -m "feat: replace localStorage auth with Supabase JWT in axios interceptor"
```

---

## Task 6: Frontend — Router context + route guards

**Files:**
- Modify: `src/routes/__root.tsx`
- Modify: `src/main.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/routes/dashboard.tsx`
- Modify: `src/routes/plano-salon.tsx`
- Modify: `src/routes/reservas.tsx`
- Modify: `src/routes/mesas.tsx`
- Modify: `src/routes/zonas.tsx`
- Modify: `src/routes/bloqueos.tsx`
- Modify: `src/routes/lista-espera.tsx`
- Modify: `src/routes/clientes.tsx`

**Interfaces:**
- Consumes: `useAuth()` from `@api/shared/hooks/use-auth`
- Produces: unauthenticated users are redirected to `/login`; clients (`role === 'cliente'`) are redirected to `/mis-reservas` when they try to access staff routes

- [ ] **Step 1: Create router context type and update `src/routes/__root.tsx`**

```tsx
import { createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { RootLayout } from '@ui/layouts/root-layout'
import type { useAuth } from '@api/shared/hooks/use-auth'

export type RouterContext = {
  auth: ReturnType<typeof useAuth>
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootRouteComponent,
})

function RootRouteComponent() {
  return (
    <>
      <RootLayout />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
```

- [ ] **Step 2: Update `src/main.tsx` to pass auth context to router**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { AppProviders } from '@/app/providers'
import { routeTree } from './routeTree.gen'
import { useAuth } from '@api/shared/hooks/use-auth'
import './index.css'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
```

- [ ] **Step 3: Update `src/routes/index.tsx` — redirect unauthenticated users to login**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
    throw redirect({ to: '/dashboard' })
  },
})
```

- [ ] **Step 4: Add `beforeLoad` guard to staff-only routes**

Apply this pattern to each of these files: `dashboard.tsx`, `plano-salon.tsx`, `reservas.tsx`, `mesas.tsx`, `zonas.tsx`, `bloqueos.tsx`, `lista-espera.tsx`, `clientes.tsx`.

Example for `dashboard.tsx`:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '@ui/pages/dashboard/dashboard-page'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' })
  },
  component: DashboardPage,
})
```

Apply the same `beforeLoad` to each of the other 7 staff route files (same 3 lines, different `createFileRoute` path string and `component`).

- [ ] **Step 5: Run dev server and verify TypeScript**

```bash
npm run dev
```

Navigate to `http://localhost:5173/dashboard` without being logged in. Expected: redirect to `/login` (which gives a 404 for now — the route doesn't exist yet, that's fine).

```bash
npx tsc --noEmit
```

Expected: no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/routes/ src/main.tsx
git commit -m "feat: add router context and auth route guards"
```

---

## Task 7: Frontend — Login page

**Files:**
- Create: `src/routes/login.tsx`
- Create: `src/ui/pages/login/login-page.tsx`

**Interfaces:**
- Consumes: `useAuth()` from `@api/shared/hooks/use-auth`
- Produces: `/login` route — email/password form + Google OAuth button. On success: staff → `/dashboard`, client → `/mis-reservas`.

- [ ] **Step 1: Create `src/routes/login.tsx`**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@ui/pages/login/login-page'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLoading && context.auth.user) {
      const dest = context.auth.role === 'cliente' ? '/mis-reservas' : '/dashboard'
      throw redirect({ to: dest })
    }
  },
  component: LoginPage,
})
```

- [ ] **Step 2: Create `src/ui/pages/login/login-page.tsx`**

```tsx
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChefHat } from 'lucide-react'
import { useAuth } from '@api/shared/hooks/use-auth'

export function LoginPage() {
  const { signIn, signInWithGoogle, role, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authError } = await signIn(email, password)
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    // navigation happens via route guard on auth state change
  }

  // Once auth state updates, router context re-evaluates and redirects automatically.
  // But navigate manually as fallback after successful login.
  if (user) {
    const dest = role === 'cliente' ? '/mis-reservas' : '/dashboard'
    navigate({ to: dest })
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <ChefHat className="size-8 text-cta" />
          <h1 className="text-xl font-bold text-primary">Restaurante Progra</h1>
          <p className="text-sm text-muted">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-primary-dark">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-primary-dark">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">o</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-primary-dark hover:bg-background-subtle"
        >
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run dev server and test login page**

```bash
npm run dev
```

Navigate to `http://localhost:5173/login`. Expected: login form with email/password fields and Google button renders correctly.

- [ ] **Step 4: Enable Google OAuth provider in Supabase**

In Supabase Dashboard → Authentication → Providers → Google:
1. Enable Google provider
2. Add Client ID and Client Secret from Google Cloud Console (OAuth 2.0 credentials)
3. Add `https://mmmfeijsrhchdivgwzhm.supabase.co/auth/v1/callback` as Authorized redirect URI in Google Console
4. Add `http://localhost:5173` and `https://proyecto-progra-six.vercel.app` to Supabase → Auth → URL Configuration → Redirect URLs

- [ ] **Step 5: Commit**

```bash
git add src/routes/login.tsx src/ui/pages/login/login-page.tsx
git commit -m "feat: add login page with email/password and Google OAuth"
```

---

## Task 8: Frontend — Mis reservas page + HTTP endpoint

**Files:**
- Create: `src/routes/mis-reservas.tsx`
- Create: `src/ui/pages/mis-reservas/mis-reservas-page.tsx`
- Modify: `src/api/http/reservas.http.ts`
- Modify: `src/api/features/reservas/services/reservas.service.ts`

**Interfaces:**
- Consumes: `GET /api/Reserva/mis-reservas` from Task 3
- Produces: `/mis-reservas` route — shows authenticated client's own reservations

- [ ] **Step 1: Add `getMisReservasHttp` to `src/api/http/reservas.http.ts`**

Add at the end of the file:

```ts
export async function getMisReservasHttp(): Promise<Reserva[]> {
  const { data } = await apiClient.get<Reserva[]>('/Reserva/mis-reservas')
  return data
}
```

- [ ] **Step 2: Add `getMisReservas` to `src/api/features/reservas/services/reservas.service.ts`**

Add at the end of the file:

```ts
import { getMisReservasHttp } from '@api/http/reservas.http'

export async function getMisReservas() {
  if (!isMockApi()) return getMisReservasHttp()
  await mockDelay()
  // ponytail: mock returns all reservas filtered by clienteId=1 for local dev
  return mockStore.getReservas().slice(0, 3)
}
```

- [ ] **Step 3: Create `src/routes/mis-reservas.tsx`**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { MisReservasPage } from '@ui/pages/mis-reservas/mis-reservas-page'

export const Route = createFileRoute('/mis-reservas')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
  component: MisReservasPage,
})
```

- [ ] **Step 4: Create `src/ui/pages/mis-reservas/mis-reservas-page.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import { getMisReservas } from '@api/features/reservas/services/reservas.service'
import { useAuth } from '@api/shared/hooks/use-auth'
import { CalendarCheck } from 'lucide-react'

export function MisReservasPage() {
  const { user } = useAuth()
  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['mis-reservas'],
    queryFn: getMisReservas,
    enabled: !!user,
  })

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <CalendarCheck className="size-6 text-cta" />
        <h1 className="text-2xl font-bold text-primary">Mis reservas</h1>
      </div>

      {isLoading && (
        <p className="text-sm text-muted">Cargando reservas…</p>
      )}

      {!isLoading && reservas.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">No tienes reservas registradas.</p>
        </div>
      )}

      {!isLoading && reservas.length > 0 && (
        <ul className="flex flex-col gap-3">
          {reservas.map((r) => (
            <li
              key={r.reservaId}
              className="rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Mesa {r.mesaId} — {new Date(r.fecha).toLocaleDateString('es-CR')}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Estado {r.estadoDeReservaId}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {new Date(r.horaInicio).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                {' – '}
                {new Date(r.horaFin).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {r.cantidaPersonas} personas
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
```

- [ ] **Step 5: Run dev server and verify route renders**

```bash
npm run dev
```

Navigate to `http://localhost:5173/mis-reservas` (while not logged in). Expected: redirect to `/login`.

- [ ] **Step 6: Commit**

```bash
git add src/routes/mis-reservas.tsx src/ui/pages/mis-reservas/ src/api/http/reservas.http.ts src/api/features/reservas/services/reservas.service.ts
git commit -m "feat: add mis-reservas page and HTTP endpoint"
```

---

## Task 9: Frontend — NavBar: user avatar, logout, role-based items

**Files:**
- Modify: `src/ui/shell/nav-bar/nav-bar.tsx`
- Modify: `src/ui/shell/nav-bar/nav-bar.types.ts` (if it exists)

**Interfaces:**
- Consumes: `useAuth()` from `@api/shared/hooks/use-auth`
- Produces: NavBar shows user initials + logout button; clients only see "Mis reservas" in the menu

- [ ] **Step 1: Read `src/ui/shell/nav-bar/nav-bar.types.ts`**

Check if it exists and what it exports. We only need to read it once before editing.

- [ ] **Step 2: Update `src/ui/shell/nav-bar/nav-bar.tsx`**

Add `useAuth` import and update the component to:
1. Filter nav items based on role — clients only see `/mis-reservas`
2. Show user initials avatar + logout button at the right end of the header

```tsx
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  Users,
  Clock,
  UtensilsCrossed,
  MapPin,
  Ban,
  ChefHat,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { AppLink } from '../app-link/app-link'
import type { NavBarProps, NavItem } from './nav-bar.types'
import { useAuth } from '@api/shared/hooks/use-auth'

const staffItems: NavItem[] = [
  { label: 'Dashboard',     to: '/dashboard',    icon: LayoutDashboard },
  { label: 'Plano salón',   to: '/plano-salon',  icon: Map },
  { label: 'Reservas',      to: '/reservas',     icon: CalendarCheck },
  { label: 'Clientes',      to: '/clientes',     icon: Users },
  { label: 'Lista espera',  to: '/lista-espera', icon: Clock },
  { label: 'Mesas',         to: '/mesas',        icon: UtensilsCrossed },
  { label: 'Zonas',         to: '/zonas',        icon: MapPin },
  { label: 'Bloqueos',      to: '/bloqueos',     icon: Ban },
]

const clienteItems: NavItem[] = [
  { label: 'Mis reservas', to: '/mis-reservas', icon: CalendarCheck },
]
```

Then inside the `NavBar` function, add:

```tsx
export function NavBar({ items }: NavBarProps) {
  const { user, role, signOut } = useAuth()
  const activeItems = items ?? (role === 'cliente' ? clienteItems : staffItems)
  // ... rest of the component uses activeItems instead of items
```

Add the user avatar + logout button to the right of the hamburger menu in the `<nav>`:

```tsx
{/* User area */}
{user && (
  <div className="flex items-center gap-2">
    <span className="hidden text-xs text-muted sm:inline">{user.name}</span>
    <button
      type="button"
      aria-label="Cerrar sesión"
      onClick={() => signOut()}
      className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-xs font-bold text-white hover:bg-primary-dark"
      title={`${user.name} — Cerrar sesión`}
    >
      {user.name.charAt(0).toUpperCase()}
    </button>
    <button
      type="button"
      aria-label="Cerrar sesión"
      onClick={() => signOut()}
      className="hidden size-8 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-background-subtle hover:text-primary-dark lg:flex"
    >
      <LogOut className="size-4" aria-hidden />
    </button>
  </div>
)}
```

> Note: The exact JSX placement is between the desktop nav `<ul>` and the hamburger `<button>`. Place the user area before the hamburger button.

- [ ] **Step 3: Update `NavBarProps` type if needed**

In `nav-bar.types.ts`, make `items` optional if it isn't already:

```ts
export type NavBarProps = {
  items?: NavItem[]
}
```

- [ ] **Step 4: Run dev server and visually verify**

```bash
npm run dev
```

Sign in with a test account. Verify:
- NavBar shows user initial in avatar
- Logout button visible
- Staff account sees all 8 nav items
- Client account only sees "Mis reservas"

- [ ] **Step 5: Commit**

```bash
git add src/ui/shell/nav-bar/
git commit -m "feat: add user avatar, logout button, and role-based nav items"
```

---

## Task 10: Deploy — Add env vars to Render and Vercel

**Files:**
- No code changes — environment variable configuration only

**Interfaces:**
- Produces: deployed backend validates Supabase JWTs; deployed frontend authenticates via Supabase

- [ ] **Step 1: Add backend env vars in Render**

In Render dashboard → your backend service → Environment:
- Add `SUPABASE_JWT_SECRET` = base64 JWT secret from Supabase Dashboard → Settings → API → JWT Settings
- Add `SUPABASE_SERVICE_ROLE_KEY` = service role key from Supabase Dashboard → Settings → API

- [ ] **Step 2: Add frontend env vars in Vercel**

In Vercel dashboard → your project → Settings → Environment Variables:
- Add `VITE_SUPABASE_URL` = `https://mmmfeijsrhchdivgwzhm.supabase.co`
- Add `VITE_SUPABASE_ANON_KEY` = anon key from Supabase Dashboard → Settings → API

- [ ] **Step 3: Push backend changes and verify Render deploy**

```bash
cd "C:\Proyecto prograII\ProyectoIProgra2"
git push origin main
```

Watch Render deploy logs. Expected: successful build and startup.

- [ ] **Step 4: Push frontend changes and verify Vercel deploy**

```bash
cd "C:\Proyecto_Progra"
git push origin main
```

Watch Vercel build logs. Expected: successful TypeScript build and deployment.

- [ ] **Step 5: End-to-end smoke test on production**

1. Open `https://proyecto-progra-six.vercel.app`
2. Expected: redirect to `/login`
3. Create a test account via Supabase Dashboard → Authentication → Users → Invite user (or register from the UI)
4. Log in → expected: redirect to `/dashboard` (staff) or `/mis-reservas` (client)
5. Log out → expected: redirect to `/login`
