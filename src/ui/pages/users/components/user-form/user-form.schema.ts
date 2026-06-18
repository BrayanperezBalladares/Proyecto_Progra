import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

export type UserFormValues = z.infer<typeof userFormSchema>
