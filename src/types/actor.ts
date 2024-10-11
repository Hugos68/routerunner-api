import type { Role } from "./role.ts";
import type { User } from "./user.ts";

export type Actor = (User & { role: Role }) | null;
