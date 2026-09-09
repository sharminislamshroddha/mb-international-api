import { FastifyInstance } from "fastify";

import userRoutes from "./user.routes";

export default async function userModule(
  app: FastifyInstance
) {
  app.register(userRoutes, {
    prefix: "/users",
  });
}
