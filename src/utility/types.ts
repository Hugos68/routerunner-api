import type { User } from "../database/models/users.model";

interface Authenticated {
	authenticated: true;
	user: User;
}

interface Unauthenticated {
	authenticated: false;
}

export interface Environment {
	// biome-ignore lint/style/useNamingConvention: Hono uses PascalCase here
	Variables: {
		session: Authenticated | Unauthenticated;
	};
}
