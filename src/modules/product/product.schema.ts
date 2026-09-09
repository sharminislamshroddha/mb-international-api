import { z } from "zod";

import { ProductStatus } from "@prisma/client";

import { paginationSchema } from "../../shared/validators";

export const createProductSchema = z.object({
  categoryId: z.string().min(1),

  brandId: z.string().optional(),

  sku: z.string().trim().min(1).max(100),

  name: z.string().trim().min(2).max(255),

  shortDescription: z
    .string()
    .trim()
    .max(500)
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  price: z.coerce.number().positive(),

  salePrice: z.coerce.number().positive().optional(),

  stockQuantity: z.coerce.number().int().min(0),

  status: z
    .enum(ProductStatus)
    .default(ProductStatus.DRAFT),

  isActive: z.boolean().optional(),

  isFeatured: z.boolean().optional(),
});

export const updateProductSchema =
  createProductSchema.partial();

export const productIdSchema = z.object({
  id: z.string().min(1),
});

export const productQuerySchema =
  paginationSchema.extend({
    categoryId: z.string().optional(),

    brandId: z.string().optional(),

    status: z
      .enum(ProductStatus)
      .optional(),

    isFeatured: z.coerce.boolean().optional(),

    isActive: z.coerce.boolean().optional(),

    sortBy: z
      .enum([
        "name",
        "price",
        "createdAt",
        "stockQuantity",
        "averageRating",
      ])
      .default("createdAt"),
  });

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;

export type ProductQueryInput =
  z.infer<typeof productQuerySchema>;