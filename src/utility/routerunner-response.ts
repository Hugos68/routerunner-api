export class RouterunnerResponse {
	data: unknown | null;
	error: Error | null;
	timestamp: Date;

	constructor(data: unknown | null, error: Error | null) {
		this.data = data;
		this.error = error
			? {
					name: error.name,
					message: error.message,
				}
			: null;
		this.timestamp = new Date();
	}

	static ok(data: unknown | null) {
		return new RouterunnerResponse(data, null);
	}

	static error(error: Error) {
		return new RouterunnerResponse(null, error);
	}
}
