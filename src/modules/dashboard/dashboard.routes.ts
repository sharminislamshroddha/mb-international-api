import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { requireRole } from "../../common/middlewares/require-role";

import { dashboardController } from "./dashboard.controller";

export default async function dashboardRoutes(
  app: FastifyInstance
) {
  app.get(
    "/stats",
    { preHandler: requireRole(Role.ADMIN, Role.SUPER_ADMIN) },
    dashboardController.getStats
  );
}
