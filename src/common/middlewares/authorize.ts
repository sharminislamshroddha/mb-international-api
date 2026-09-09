import { Role } from "@prisma/client";
import { FastifyRequest } from "fastify";

import { AppError } from "../../shared/errors/AppError";

export function authorize(...roles: Role[]) {
  return async function (request: FastifyRequest) {
    if (!roles.includes(request.user.role)) {
      throw new AppError(
        403,
        "You do not have permission to perform this action."
      );
    }
  };
}
