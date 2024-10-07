export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

export class BadCredentialsError extends Error {
	constructor() {
		super("The provided credentials are incorrect.");
		this.name = "BadCredentialsError";
	}
}

export class FilterError extends Error {
	constructor(column: string, table: string) {
		super(`The column "${column}" does not exist in the table: "${table}".`);
		this.name = "FilterError";
	}
}
