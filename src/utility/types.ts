import type { Session } from "../database/schema.js";

export interface Environment {
	// biome-ignore lint/style/useNamingConvention:
	Variables: {
		session: Session | null;
	};
}
