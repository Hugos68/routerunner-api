import type { Role } from "../database/schema.js";
import type { User } from "../database/schema.js";

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
