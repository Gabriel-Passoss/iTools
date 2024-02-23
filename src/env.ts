import { z } from 'zod'

const envSchema = z.object({
  MODE: z.enum(['production', 'development', 'test']),
  VITE_ENABLE_API_DELAY: z.string().transform((value) => value === 'true'),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
})

export const env = envSchema.parse(import.meta.env)
