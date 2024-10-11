import { createSelectSchema } from "drizzle-zod";
import { rolesTable } from "../database/tables/roles.ts";

export const RoleSchema = createSelectSchema(rolesTable);
export const CreateRoleSchema = RoleSchema.omit({ id: true });
export const UpdateRoleSchema = CreateRoleSchema.partial();
export const RoleParamsSchema = RoleSchema.pick({ id: true });
export const RoleQuerySchema = RoleSchema.partial();
