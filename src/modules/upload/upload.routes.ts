import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { requireRole } from "../../common/middlewares/require-role";

import { uploadController } from "./upload.controller";

export default async function uploadRoutes(
  app: FastifyInstance
) {
  app.post(
    "/image",
    { preHandler: requireRole(Role.ADMIN, Role.SUPER_ADMIN) },
    uploadController.uploadImage
  );
}
