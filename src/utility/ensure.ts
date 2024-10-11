import type { Actor } from "../types/actor.ts";
import type { Role } from "../types/role.ts";

export const ensure = <T extends Error>(actor: Actor | null) => {
	let isAuthorized = true;
	let customError: T | null = null;

	const checkAndUpdateAuth = (condition: boolean) => {
		isAuthorized = isAuthorized && condition;
	};

	const throwIfUnauthorized = () => {
		if (!isAuthorized) {
			if (customError) {
				throw customError;
			}
			throw new Error("Unauthorized");
		}
	};

	return {
		toBeLoggedIn: () => {
			checkAndUpdateAuth(actor !== null);
			return this;
		},
		hasRoles: (...roles: Role["name"][]) => {
			checkAndUpdateAuth(actor !== null && roles.includes(actor.role.name));
			return this;
		},
		refine: (callback: (actor: Actor | null) => boolean) => {
			checkAndUpdateAuth(callback(actor));
			return this;
		},
		orElseThrow: (error: T) => {
			customError = error;
			throwIfUnauthorized();
		},
	};
};
