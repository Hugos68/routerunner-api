export class RouterunnerResponse {
	data: unknown | null;
	error: {
		name: string;
		message: string;
	} | null;

	constructor(
		data: unknown | null,
		error: { name: string; message: string } | null,
	) {
		this.data = data;
		this.error = error;
	}

	static data(data: unknown | null) {
		return new RouterunnerResponse(data, null);
	}

	static error(error: { name: string; message: string }) {
		return new RouterunnerResponse(null, error);
	}
}
