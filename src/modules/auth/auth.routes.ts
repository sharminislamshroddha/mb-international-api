import { FastifyInstance } from "fastify";

import { authenticate } from "../../common/middlewares/authenticate";

import { authController } from "./auth.controller";

export default async function authRoutes(
  app: FastifyInstance
) {
  app.post("/register", authController.register);

  app.post("/login", authController.login);

  app.post("/google", authController.google);

  app.post("/facebook", authController.facebook);

  app.get(
    "/me",
    { preHandler: authenticate },
    authController.me
  );
}
