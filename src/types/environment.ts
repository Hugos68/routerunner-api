import type { Actor } from "./actor.ts";

export interface Environment {
	// biome-ignore lint/style/useNamingConvention:
	Variables: {
		actor: Actor | null;
	};
}
