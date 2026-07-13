import { z } from "zod";
import { paginationSchema } from "../../shared/validators";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required.").max(100),

  description: z.string().trim().max(500).optional(),

  imageUrl: z.string().optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;


export const categoryIdSchema = z.object({
  id: z.string().min(1, "Category ID is required."),
});


export const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  description: z.string().trim().max(500).optional(),

  imageUrl: z.string().optional(),

  isActive: z.boolean().optional(),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;


export const categoryQuerySchema = paginationSchema.extend({
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  isActive: z.coerce.boolean().optional(),
});
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;