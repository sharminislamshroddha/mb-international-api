import { z } from "zod";

export const createProductImageSchema = z.object({
  imageUrl: z.string().trim().min(1),

  altText: z.string().trim().max(255).optional(),

  isPrimary: z.boolean().optional(),

  sortOrder: z.coerce.number().int().min(0).optional(),
});

export const updateProductImageSchema =
  createProductImageSchema.partial();

export const productImageParamsSchema = z.object({
  productId: z.string().min(1),
});

export const productImageIdParamsSchema = z.object({
  productId: z.string().min(1),
  imageId: z.string().min(1),
});

export type CreateProductImageInput =
  z.infer<typeof createProductImageSchema>;

export type UpdateProductImageInput =
  z.infer<typeof updateProductImageSchema>;