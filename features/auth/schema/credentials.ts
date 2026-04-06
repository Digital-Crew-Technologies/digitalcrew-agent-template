import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const signUpSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8),
})

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
