import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";

import { env } from "../config/env";

export default async function corsPlugin(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE"],
  });
}
