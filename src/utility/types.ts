import type { Role, User } from "../database/schema.js";

export interface Environment {
	// biome-ignore lint/style/useNamingConvention:
	Variables: {
		session: {
			user: User & { role: Role };
		} | null;
	};
}
