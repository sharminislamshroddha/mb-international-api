import { FastifyInstance } from "fastify";

import { productController } from "./product.controller";

export default async function productRoutes(
  app: FastifyInstance
) {
  app.post(
    "/",
    productController.create
  );

  app.get(
    "/",
    productController.getAll
  );

  app.get(
    "/:id",
    productController.getById
  );

  app.patch(
    "/:id",
    productController.update
  );

  app.delete(
    "/:id",
    productController.delete
  );
}