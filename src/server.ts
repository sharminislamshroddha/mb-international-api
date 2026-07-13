import "dotenv/config";
import { buildApp } from "./app.js";

const app = buildApp();

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 5000,
      host: "0.0.0.0",
    });

    console.log("🚀 Server running");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();