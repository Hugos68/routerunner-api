import type { z } from "zod";
import type {
	CreateRoleSchema,
	RoleSchema,
	UpdateRoleSchema,
} from "../schemas/roles.ts";

export type Role = z.infer<typeof RoleSchema>;
export type RoleToCreate = z.infer<typeof CreateRoleSchema>;
export type RoleToUpdate = z.infer<typeof UpdateRoleSchema>;
