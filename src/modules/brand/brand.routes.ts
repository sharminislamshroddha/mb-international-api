import { FastifyInstance } from "fastify";

import { brandController } from "./brand.controller";

export default async function brandRoutes(
  app: FastifyInstance
) {
  app.post("/", brandController.create);
  app.get("/", brandController.getAll);
  app.get("/:id", brandController.getById);
  app.patch("/:id", brandController.update);
  app.delete("/:id", brandController.delete);
}