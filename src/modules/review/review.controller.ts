import { FastifyReply, FastifyRequest } from "fastify";

import { Role } from "@prisma/client";

import { successResponse } from "../../shared/helpers/response";

import {
  createReviewSchema,
  reviewIdParamsSchema,
  reviewProductParamsSchema,
  reviewQuerySchema,
  updateReviewSchema,
} from "./review.schema";

import { reviewService } from "./review.service";

function isAdminRole(role: Role) {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}

class ReviewController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { productId } =
      reviewProductParamsSchema.parse(request.params);

    const payload = createReviewSchema.parse(
      request.body
    );

    const review = await reviewService.create(
      productId,
      request.user.id,
      payload
    );

    return successResponse({
      reply,
      statusCode: 201,
      message: "Review created successfully.",
      data: review,
    });
  }

  async getByProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { productId } =
      reviewProductParamsSchema.parse(request.params);

    const query = reviewQuerySchema.parse(request.query);

    const result = await reviewService.getByProduct(
      productId,
      query
    );

    return reply.send({
      success: true,
      message: "Reviews fetched successfully.",
      ...result,
    });
  }

  async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const query = reviewQuerySchema.parse(request.query);

    const result = await reviewService.getAll(query);

    return reply.send({
      success: true,
      message: "Reviews fetched successfully.",
      ...result,
    });
  }

  async update(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = reviewIdParamsSchema.parse(
      request.params
    );

    const payload = updateReviewSchema.parse(
      request.body
    );

    const review = await reviewService.update(
      id,
      request.user.id,
      payload,
      isAdminRole(request.user.role)
    );

    return successResponse({
      reply,
      message: "Review updated successfully.",
      data: review,
    });
  }

  async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = reviewIdParamsSchema.parse(
      request.params
    );

    await reviewService.delete(
      id,
      request.user.id,
      isAdminRole(request.user.role)
    );

    return successResponse({
      reply,
      message: "Review deleted successfully.",
    });
  }
}

export const reviewController = new ReviewController();
