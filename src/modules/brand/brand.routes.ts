import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { requireRole } from "../../common/middlewares/require-role";

import { brandController } from "./brand.controller";

const adminOnly = requireRole(Role.ADMIN, Role.SUPER_ADMIN);

export default async function brandRoutes(
  app: FastifyInstance
) {
  app.post("/", { preHandler: adminOnly }, brandController.create);
  app.get("/", brandController.getAll);
  app.get("/:id", brandController.getById);
  app.patch("/:id", { preHandler: adminOnly }, brandController.update);
  app.delete("/:id", { preHandler: adminOnly }, brandController.delete);
}
