import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

import { env } from "../config/env";

export default async function jwtPlugin(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  });
}
