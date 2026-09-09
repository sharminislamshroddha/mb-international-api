import Fastify from "fastify";

import prisma from "./database/prisma";
import routes from "./routes";
import corsPlugin from "./plugins/cors";
import errorHandler from "./plugins/error-handler";
import jwtPlugin from "./plugins/jwt";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  errorHandler(app);

  corsPlugin(app);
  jwtPlugin(app);

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