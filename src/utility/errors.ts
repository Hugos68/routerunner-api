import type { OpenAPIHonoOptions } from "@hono/zod-openapi";
import type { StatusCode } from "hono/utils/http-status";
import type { Environment } from "../types/environment.ts";

export class RouterunnerError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "RouterunnerError";
	}
}

export class ResourceNotFoundError extends RouterunnerError {
	constructor() {
		super("Resource not found");
		this.name = "NotFoundError";
	}
}

export class BadCredentialsError extends RouterunnerError {
	constructor() {
		super("The provided credentials are invalid");
		this.name = "BadCredentialsError";
	}
}

export class UnauthorizedError extends RouterunnerError {
	constructor() {
		super("Unauthorized");
		this.name = "UnauthorizedError";
	}
}

export class ValidationError extends RouterunnerError {
	constructor(
		result: Parameters<
			Required<OpenAPIHonoOptions<Environment>>["defaultHook"]
		>[0],
	) {
		if (result.success) {
			throw new Error("Unexpected success from validation hook");
		}
		const issue = result.error.errors.at(0);
		if (issue) {
			super(
				`${issue.message} for "${issue.path.join(".")}" in ${result.target}`,
			);
		} else {
			super("Validation failed");
		}

		this.name = "ValidationError";
	}
}

export class BadFilterError extends RouterunnerError {
	constructor(property: string, resource: string) {
		super(
			`The property "${property}" does not exist in the resource: "${resource}".`,
		);
		this.name = "InvalidFilterError";
	}
}

const errorStatusCodeMap = new Map<unknown, StatusCode>([
	[RouterunnerError, 500],
	[ResourceNotFoundError, 404],
	[BadCredentialsError, 401],
	[UnauthorizedError, 401],
	[ValidationError, 422],
	[BadFilterError, 400],
]);

export function getStatusCode(error: RouterunnerError) {
	const statusCode = errorStatusCodeMap.get(error.constructor);
	if (statusCode === undefined) {
		return 500;
	}
	return statusCode;
}
