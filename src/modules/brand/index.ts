import { FastifyInstance } from "fastify";

import brandRoutes from "./brand.routes";

export default async function brandModule(
  app: FastifyInstance
) {
  app.register(brandRoutes, {
    prefix: "/brands",
  });
}