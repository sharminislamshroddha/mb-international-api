import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export default async function staticPlugin(app: FastifyInstance) {
  mkdirSync(UPLOAD_DIR, { recursive: true });

  app.register(fastifyStatic, {
    root: UPLOAD_DIR,
    prefix: "/uploads/",
  });
}
