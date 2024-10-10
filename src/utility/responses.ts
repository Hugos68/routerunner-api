import { z } from "zod";

export class RouterunnerResponse<T> {
	data?: T;
	error?: Error;
	timestamp: Date;

	constructor(data?: T, error?: Error) {
		this.data = data;
		this.error = error;
		this.timestamp = new Date();
	}

	static ok(data: unknown | null) {
		return new RouterunnerResponse(data, undefined);
	}

	static error(error: Error) {
		return new RouterunnerResponse(undefined, error);
	}
}

export const createOkSchema = (DataSchema?: z.Schema) => {
	return z.object({
		data: DataSchema ? DataSchema : z.null(),
		timestamp: z.date(),
	});
};

export const ErrorSchema = z.object({
	error: z.object({
		name: z.string(),
		message: z.string(),
	}),
	timestamp: z.date(),
});
