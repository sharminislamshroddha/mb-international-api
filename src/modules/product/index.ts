import { FastifyInstance } from "fastify";

import productRoutes from "./product.routes";

export default async function productModule(
  app: FastifyInstance
) {
  app.register(productRoutes, {
    prefix: "/products",
  });
}