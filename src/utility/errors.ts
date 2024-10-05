export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

export class BadCredentialsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BadCredentialsError";
	}
}
