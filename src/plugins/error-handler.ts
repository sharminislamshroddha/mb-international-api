import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { AppError } from "../shared/errors/AppError";

export default async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        message: "Validation failed.",
        errors: error.flatten(),
      });
    }

    if (
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number" &&
      error.statusCode >= 400 &&
      error.statusCode < 500
    ) {
      return reply.status(error.statusCode).send({
        success: false,
        message: error.message,
      });
    }

    return reply.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  });
}