import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),

  password: z.string().min(8).max(72),

  firstName: z.string().trim().min(1).max(100),

  lastName: z.string().trim().min(1).max(100),

  phone: z.string().trim().min(7).max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),

  password: z.string().min(1),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1),
});

export const facebookAuthSchema = z.object({
  accessToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;

export type FacebookAuthInput = z.infer<typeof facebookAuthSchema>;
