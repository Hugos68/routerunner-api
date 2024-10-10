import type { Role } from "./roles.ts";
import type { User } from "./users.ts";

export type Actor = (User & { role: Role }) | null;
