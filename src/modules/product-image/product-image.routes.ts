import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { requireRole } from "../../common/middlewares/require-role";

import { productImageController } from "./product-image.controller";

const adminOnly = requireRole(Role.ADMIN, Role.SUPER_ADMIN);

export default async function productImageRoutes(
  app: FastifyInstance
) {
  app.post(
    "/:productId/images",
    { preHandler: adminOnly },
    productImageController.create
  );

  app.get(
    "/:productId/images",
    productImageController.getAll
  );

  app.patch(
    "/:productId/images/:imageId",
    { preHandler: adminOnly },
    productImageController.update
  );

  app.delete(
    "/:productId/images/:imageId",
    { preHandler: adminOnly },
    productImageController.delete
  );
}
