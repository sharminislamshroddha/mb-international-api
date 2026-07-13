import Fastify from "fastify";

import prisma from "./database/prisma";
import routes from "./routes";
import errorHandler from "./plugins/error-handler";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  errorHandler(app);

  app.get("/health", async () => ({
    success: true,
    message: "Server is running",
  }));

  app.get("/db-test", async () => {
    await prisma.$queryRaw`SELECT 1`;

    return {
      success: true,
      message: "Database connected successfully",
    };
  });

  app.register(routes);

  return app;
}