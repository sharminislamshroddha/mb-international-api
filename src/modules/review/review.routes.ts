import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";

import { authenticate } from "../../common/middlewares/authenticate";
import { requireRole } from "../../common/middlewares/require-role";

import { reviewController } from "./review.controller";

export default async function reviewRoutes(
  app: FastifyInstance
) {
  app.post(
    "/:productId/reviews",
    { preHandler: authenticate },
    reviewController.create
  );

  app.get(
    "/:productId/reviews",
    reviewController.getByProduct
  );
}

export async function reviewSelfRoutes(
  app: FastifyInstance
) {
  app.get(
    "/",
    { preHandler: requireRole(Role.ADMIN, Role.SUPER_ADMIN) },
    reviewController.getAll
  );

  app.patch(
    "/:id",
    { preHandler: authenticate },
    reviewController.update
  );

  app.delete(
    "/:id",
    { preHandler: authenticate },
    reviewController.delete
  );
}
