import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { requireRole } from "../../common/middlewares/require-role";

import { productController } from "./product.controller";

const adminOnly = requireRole(Role.ADMIN, Role.SUPER_ADMIN);

export default async function productRoutes(
  app: FastifyInstance
) {
  app.post(
    "/",
    { preHandler: adminOnly },
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
    { preHandler: adminOnly },
    productController.update
  );

  app.delete(
    "/:id",
    { preHandler: adminOnly },
    productController.delete
  );
}
