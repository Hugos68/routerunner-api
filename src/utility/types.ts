import type { Role } from "../database/schema.js";
import type { User } from "../database/schema.js";

interface Authenticated {
	authenticated: true;
	user: User & {
		role: Role;
	};
}

interface Unauthenticated {
	authenticated: false;
}

export interface Environment {
	// biome-ignore lint/style/useNamingConvention:
	Variables: {
		session: Authenticated | Unauthenticated;
	};
}
