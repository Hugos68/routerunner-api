import { z } from "zod";

export class RouterunnerResponse {
	data: unknown | null;
	error: {
		name: string;
		message: string;
	} | null;
	timestamp: Date;

	constructor(
		data: unknown | null,
		error: { name: string; message: string } | null,
	) {
		this.data = data;
		this.error = error;
		this.timestamp = new Date();
	}

	static data(data: unknown | null) {
		return new RouterunnerResponse(data, null);
	}

	static error(error: { name: string; message: string }) {
		return new RouterunnerResponse(null, error);
	}
}

export const createOkResponseSchema = (DataSchema?: z.Schema) => {
	return z.object({
		data: DataSchema ? DataSchema : z.null(),
		error: z.null(),
		timestamp: z.date(),
	});
};

export const createErrorResponseSchema = () => {
	return z.object({
		data: z.null(),
		error: z.object({
			name: z.string(),
			message: z.string(),
		}),
		timestamp: z.date(),
	});
};
