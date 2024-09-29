import type { Role } from "../database/tables/roles.js";
import type { User } from "../database/tables/users.js";

interface authenticated {
	authenticated: true;
	user: User & {
		role: Role;
	};
}

interface unauthenticated {
	authenticated: false;
}

export interface Environment {
	Variables: {
		session: authenticated | unauthenticated;
	};
}
