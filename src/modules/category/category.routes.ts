import { FastifyInstance } from "fastify";

import { categoryController } from "./category.controller";

export default async function categoryRoutes(
  app: FastifyInstance
) {
  app.post("/", categoryController.create);
  app.get("/", categoryController.getAll);
  app.get("/:id", categoryController.getById);
  app.patch("/:id", categoryController.update);
  app.delete("/:id", categoryController.delete);
}