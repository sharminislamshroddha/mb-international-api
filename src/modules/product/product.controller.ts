import { FastifyReply, FastifyRequest } from "fastify";

import { successResponse } from "../../shared/helpers/response";

import {
  productIdSchema,
  createProductSchema,
  productQuerySchema,
  updateProductSchema,
} from "./product.schema";

import { productService } from "./product.service";

class ProductController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload = createProductSchema.parse(request.body);

    const product = await productService.create(payload);

    return successResponse({
      reply,
      statusCode: 201,
      message: "Product created successfully.",
      data: product,
    });
  }

  async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const query = productQuerySchema.parse(request.query);

    const result = await productService.getAll(query);

    return reply.send({
      success: true,
      message: "Products fetched successfully.",
      ...result,
    });
  }

  async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = productIdSchema.parse(request.params);

    const product = await productService.getById(id);

    return successResponse({
      reply,
      message: "Product retrieved successfully.",
      data: product,
    });
  }

  async update(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = productIdSchema.parse(request.params);

    const payload = updateProductSchema.parse(request.body);

    const product = await productService.update(
      id,
      payload
    );

    return successResponse({
      reply,
      message: "Product updated successfully.",
      data: product,
    });
  }

  async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = productIdSchema.parse(request.params);

    await productService.delete(id);

    return successResponse({
      reply,
      message: "Product deleted successfully.",
    });
  }
}

export const productController = new ProductController();