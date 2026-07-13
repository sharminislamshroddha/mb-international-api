import { FastifyReply, FastifyRequest } from "fastify";

import { successResponse } from "../../shared/helpers/response";

import { brandService } from "./brand.service";
import { brandIdSchema, brandQuerySchema, createBrandSchema, updateBrandSchema,} from "./brand.schema";

class BrandController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const body = createBrandSchema.parse(request.body);

    const brand = await brandService.create(body);

    return successResponse({
      reply,
      statusCode: 201,
      message: "Brand created successfully.",
      data: brand,
    });
  }

  async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const query = brandQuerySchema.parse(request.query);

    const result = await brandService.getAll(query);

    return reply.send({
      success: true,
      message: "Brands fetched successfully.",
      ...result,
    });
  }

  async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = brandIdSchema.parse(request.params);

    const brand = await brandService.getById(id);

    return successResponse({
      reply,
      message: "Brand fetched successfully.",
      data: brand,
    });
  }

  async update(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = brandIdSchema.parse(request.params);

    const body = updateBrandSchema.parse(request.body);

    const brand = await brandService.update(id, body);

    return successResponse({
      reply,
      message: "Brand updated successfully.",
      data: brand,
    });
  }

  async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = brandIdSchema.parse(request.params);

    await brandService.delete(id);

    return successResponse({
      reply,
      message: "Brand deleted successfully.",
    });
  }
}

export const brandController = new BrandController();