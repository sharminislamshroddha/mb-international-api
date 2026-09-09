import { FastifyInstance } from "fastify";

import productImageRoutes from "./product-image.routes";

export default async function productImageModule(
  app: FastifyInstance
) {
  app.register(productImageRoutes, {
    prefix: "/products",
  });
}