import { FastifyInstance } from "fastify";

import reviewRoutes, { reviewSelfRoutes } from "./review.routes";

export default async function reviewModule(
  app: FastifyInstance
) {
  app.register(reviewRoutes, {
    prefix: "/products",
  });

  app.register(reviewSelfRoutes, {
    prefix: "/reviews",
  });
}
