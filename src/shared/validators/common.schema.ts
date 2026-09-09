import { z } from "zod";

// z.coerce.boolean() treats any non-empty string as true (including
// the literal string "false"), so a query string like ?isActive=false
// silently coerces to true. This parses the two real string values a
// query param can carry instead.
export const booleanQueryParam = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  sortBy: z.string().optional(),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});