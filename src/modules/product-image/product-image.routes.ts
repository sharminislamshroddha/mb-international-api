import { FastifyInstance } from "fastify";

import { productImageController } from "./product-image.controller";

export default async function productImageRoutes(
  app: FastifyInstance
) {
  app.post(
    "/:productId/images",
    productImageController.create
  );

  app.get(
    "/:productId/images",
    productImageController.getAll
  );

  app.patch(
    "/:productId/images/:imageId",
    productImageController.update
  );

  app.delete(
    "/:productId/images/:imageId",
    productImageController.delete
  );
}