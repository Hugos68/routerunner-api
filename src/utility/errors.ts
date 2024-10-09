export class NotFoundError extends Error {
	constructor() {
		super("Resource not found");
		this.name = "NotFoundError";
	}
}

export class InvalidFilterError extends Error {
	constructor(property: string, resource: string) {
		super(
			`The property "${property}" does not exist in the resource: "${resource}".`,
		);
		this.name = "InvalidFilterError";
	}
}

export class UnauthorizedError extends Error {
	constructor() {
		super("Unauthorized");
		this.name = "UnauthorizedError";
	}
}
