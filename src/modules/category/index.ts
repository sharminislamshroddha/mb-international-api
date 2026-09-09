import { FastifyInstance } from "fastify";

import categoryRoutes from "./category.routes";

export default async function categoryModule(
  app: FastifyInstance
) {
  app.register(categoryRoutes, {
    prefix: "/categories",
  });
}