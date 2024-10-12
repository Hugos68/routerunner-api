import type { Actor } from "../types/actor.ts";
import type { Role } from "../types/role.ts";
import type { RouterunnerError } from "./errors.ts";

type AuthorizationCheck = (actor: Actor | null) => boolean;

class AuthorizationGroup {
	checks: AuthorizationCheck[] = [];

	addCheck(check: AuthorizationCheck) {
		this.checks.push(check);
	}

	evaluate(actor: Actor | null): boolean {
		return this.checks.every((check) => check(actor));
	}
}

class AuthorizationBuilder {
	private actor: Actor | null;
	private groups: AuthorizationGroup[] = [new AuthorizationGroup()];

	constructor(actor: Actor | null) {
		this.actor = actor;
	}

	private currentGroup(): AuthorizationGroup {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return this.groups.at(-1)!;
	}

	isAuthenticated(): this {
		this.currentGroup().addCheck((actor) => actor !== null);
		return this;
	}

	hasRole(...roles: Role["name"][]): this {
		this.currentGroup().addCheck(
			(actor) => actor !== null && roles.includes(actor.role.name),
		);
		return this;
	}

	satisfies(check: AuthorizationCheck): this {
		this.currentGroup().addCheck(check);
		return this;
	}

	or(): this {
		this.groups.push(new AuthorizationGroup());
		return this;
	}

	orElseThrow(error: RouterunnerError): void {
		const isAuthorized = this.groups.some((group) =>
			group.evaluate(this.actor),
		);
		if (!isAuthorized) {
			throw error;
		}
	}
}

export const authorize = (actor: Actor | null): AuthorizationBuilder => {
	return new AuthorizationBuilder(actor);
};
