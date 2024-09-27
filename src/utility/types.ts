import type { User } from "../database/models/users.model";

export interface Environment {
	// biome-ignore lint/style/useNamingConvention: Hono uses PascalCase here
	Variables: {
		session:
			| {
					authenticated: false;
			  }
			| {
					authenticated: true;
					user: User;
			  };
	};
}
