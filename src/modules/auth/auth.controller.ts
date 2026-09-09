import { FastifyReply, FastifyRequest } from "fastify";

import { successResponse } from "../../shared/helpers/response";

import {
  facebookAuthSchema,
  googleAuthSchema,
  loginSchema,
  registerSchema,
} from "./auth.schema";

import { authService } from "./auth.service";

class AuthController {
  async register(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload = registerSchema.parse(request.body);

    const user = await authService.register(payload);

    const token = request.server.jwt.sign({
      id: user.id,
      role: user.role,
    });

    return successResponse({
      reply,
      statusCode: 201,
      message: "Registered successfully.",
      data: { user, token },
    });
  }

  async login(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload = loginSchema.parse(request.body);

    const user = await authService.login(payload);

    const token = request.server.jwt.sign({
      id: user.id,
      role: user.role,
    });

    return successResponse({
      reply,
      message: "Logged in successfully.",
      data: { user, token },
    });
  }

  async google(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload = googleAuthSchema.parse(request.body);

    const user = await authService.loginWithGoogle(payload);

    const token = request.server.jwt.sign({
      id: user.id,
      role: user.role,
    });

    return successResponse({
      reply,
      message: "Logged in successfully.",
      data: { user, token },
    });
  }

  async facebook(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload = facebookAuthSchema.parse(request.body);

    const user = await authService.loginWithFacebook(payload);

    const token = request.server.jwt.sign({
      id: user.id,
      role: user.role,
    });

    return successResponse({
      reply,
      message: "Logged in successfully.",
      data: { user, token },
    });
  }

  async me(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const user = await authService.getById(request.user.id);

    return successResponse({
      reply,
      message: "User retrieved successfully.",
      data: user,
    });
  }
}

export const authController = new AuthController();
