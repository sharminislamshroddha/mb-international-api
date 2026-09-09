import { Role } from "@prisma/client";
import { z } from "zod";

import { paginationSchema } from "../../shared/validators";

export const userQuerySchema = paginationSchema.extend({
  role: z.enum(Role).optional(),

  isActive: z.coerce.boolean().optional(),

  sortBy: z
    .enum(["firstName", "email", "createdAt"])
    .default("createdAt"),
});

export const userIdSchema = z.object({
  id: z.string().min(1),
});

export const createAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email(),

  password: z.string().min(8).max(72),

  firstName: z.string().trim().min(1).max(100),

  lastName: z.string().trim().min(1).max(100),

  phone: z.string().trim().min(7).max(20).optional(),

  role: z.enum([Role.ADMIN, Role.SUPER_ADMIN]),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(Role),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UserQueryInput = z.infer<typeof userQuerySchema>;

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

export type UpdateUserRoleInput = z.infer<
  typeof updateUserRoleSchema
>;

export type UpdateUserStatusInput = z.infer<
  typeof updateUserStatusSchema
>;
