import { FastifyReply, FastifyRequest } from "fastify";

import { successResponse } from "../../shared/helpers/response";

import {
  createAdminSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdSchema,
  userQuerySchema,
} from "./user.schema";

import { userService } from "./user.service";

class UserController {
  async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const query = userQuerySchema.parse(request.query);

    const result = await userService.getAll(query);

    return reply.send({
      success: true,
      message: "Users fetched successfully.",
      ...result,
    });
  }

  async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = userIdSchema.parse(request.params);

    const user = await userService.getById(id);

    return successResponse({
      reply,
      message: "User fetched successfully.",
      data: user,
    });
  }

  async createAdmin(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload = createAdminSchema.parse(request.body);

    const user = await userService.createAdmin(payload);

    return successResponse({
      reply,
      statusCode: 201,
      message: "Admin account created successfully.",
      data: user,
    });
  }

  async updateRole(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = userIdSchema.parse(request.params);

    const payload = updateUserRoleSchema.parse(request.body);

    const user = await userService.updateRole(
      id,
      request.user.id,
      payload
    );

    return successResponse({
      reply,
      message: "User role updated successfully.",
      data: user,
    });
  }

  async updateStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = userIdSchema.parse(request.params);

    const payload = updateUserStatusSchema.parse(request.body);

    const user = await userService.updateStatus(
      id,
      request.user.id,
      payload
    );

    return successResponse({
      reply,
      message: "User status updated successfully.",
      data: user,
    });
  }
}

export const userController = new UserController();
