import { z } from "zod";

import { paginationSchema } from "../../shared/validators";

export const createBrandSchema = z.object({
  name: z.string().trim().min(2).max(100),

  description: z.string().trim().max(500).optional(),

  logoUrl: z.string().optional(),

  websiteUrl: z.string().optional(),
});

export const updateBrandSchema = createBrandSchema.partial().extend({ isActive: z.boolean().optional(),});

export const brandIdSchema = z.object({ id: z.string().min(1),});

export const brandQuerySchema =
  paginationSchema.extend({
    sortBy: z
      .enum(["name", "createdAt"])
      .default("createdAt"),

    isActive: z.coerce.boolean().optional(),
  });

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

export type BrandQueryInput = z.infer<typeof brandQuerySchema>;