import type { Role } from "./roles.ts";
import type { User } from "./users.ts";

export interface Environment {
	// biome-ignore lint/style/useNamingConvention:
	Variables: {
		session: {
			user: User & { role: Role };
		} | null;
	};
}
