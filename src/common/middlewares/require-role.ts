import { Role } from "@prisma/client";

import { authenticate } from "./authenticate";
import { authorize } from "./authorize";

export function requireRole(...roles: Role[]) {
  return [authenticate, authorize(...roles)];
}
