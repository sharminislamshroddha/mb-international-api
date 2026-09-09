import { z } from "zod";

import { booleanQueryParam, paginationSchema } from "../../shared/validators";

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),

  title: z.string().trim().max(150).optional(),

  comment: z.string().trim().max(2000).optional(),
});

export const updateReviewSchema = createReviewSchema.partial();

export const reviewProductParamsSchema = z.object({
  productId: z.string().min(1),
});

export const reviewIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const reviewQuerySchema = paginationSchema.extend({
  rating: z.coerce.number().int().min(1).max(5).optional(),

  productId: z.string().optional(),

  categoryId: z.string().optional(),

  isPublished: booleanQueryParam,

  sortBy: z.enum(["createdAt", "rating"]).default("createdAt"),
});

export const updateReviewPublishedSchema = z.object({
  isPublished: z.boolean(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;

export type UpdateReviewPublishedInput = z.infer<
  typeof updateReviewPublishedSchema
>;
