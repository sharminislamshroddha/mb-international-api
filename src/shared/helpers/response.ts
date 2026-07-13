import { FastifyReply } from "fastify";

interface SuccessResponse<T> {
  reply: FastifyReply;
  message: string;
  data?: T;
  statusCode?: number;
}

export function successResponse<T>({
  reply,
  message,
  data,
  statusCode = 200,
}: SuccessResponse<T>) {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  });
}

interface ErrorResponse {
  reply: FastifyReply;
  message: string;
  statusCode?: number;
  errors?: unknown;
}

export function errorResponse({
  reply,
  message,
  statusCode = 400,
  errors,
}: ErrorResponse) {
  return reply.status(statusCode).send({
    success: false,
    message,
    errors,
  });
}