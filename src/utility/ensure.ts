import type { Actor } from "../types/actor.ts";
import type { Role } from "../types/role.ts";
import { UnauthorizedError } from "./errors.ts";

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
			throw new UnauthorizedError();
		}
	};

	const createChain = () => ({
		isAuthenticated: () => {
			checkAndUpdateAuth(actor !== null);
			return createChain();
		},
		hasRoles: (...roles: Role["name"][]) => {
			checkAndUpdateAuth(actor !== null && roles.includes(actor.role.name));
			return createChain();
		},
		when: (callback: (actor: Actor | null) => boolean) => {
			checkAndUpdateAuth(callback(actor));
			return createChain();
		},
		throwCustomError: (error: T) => {
			customError = error;
			throwIfUnauthorized();
		},
	});

	return createChain();
};
