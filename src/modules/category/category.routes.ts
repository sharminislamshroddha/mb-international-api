import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { requireRole } from "../../common/middlewares/require-role";

import { categoryController } from "./category.controller";

const adminOnly = requireRole(Role.ADMIN, Role.SUPER_ADMIN);

export default async function categoryRoutes(
  app: FastifyInstance
) {
  app.post("/", { preHandler: adminOnly }, categoryController.create);
  app.get("/", categoryController.getAll);
  app.get("/:id", categoryController.getById);
  app.patch("/:id", { preHandler: adminOnly }, categoryController.update);
  app.delete("/:id", { preHandler: adminOnly }, categoryController.delete);
}
