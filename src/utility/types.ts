import type { Role } from "../database/models/roles.model";
import type { User } from "../database/models/users.model";

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
	// biome-ignore lint/style/useNamingConvention: Hono uses PascalCase here
	Variables: {
		session: Authenticated | Unauthenticated;
	};
}
