import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { authenticate } from "../../common/middlewares/authenticate";
import { authorize } from "../../common/middlewares/authorize";

import { userController } from "./user.controller";

export default async function userRoutes(
  app: FastifyInstance
) {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", authorize(Role.SUPER_ADMIN));

  app.get("/", userController.getAll);

  app.get("/:id", userController.getById);

  app.post("/", userController.createAdmin);

  app.patch("/:id/role", userController.updateRole);

  app.patch("/:id/status", userController.updateStatus);
}
