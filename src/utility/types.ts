import type { Session } from "../database/schema.js";

interface Authenticated extends Session {
	authenticated: true;
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
