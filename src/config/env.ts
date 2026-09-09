import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),

  JWT_EXPIRES_IN: z.string().default("7d"),

  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  GOOGLE_CLIENT_ID: z.string().optional(),

  FACEBOOK_APP_ID: z.string().optional(),

  FACEBOOK_APP_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
