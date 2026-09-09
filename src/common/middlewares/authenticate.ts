import { FastifyRequest } from "fastify";

import { AppError } from "../../shared/errors/AppError";

export async function authenticate(
  request: FastifyRequest
) {
  try {
    await request.jwtVerify();
  } catch {
    throw new AppError(401, "Authentication required.");
  }
}
