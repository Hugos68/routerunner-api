import { z } from "zod";

export const createOkSchema = (DataSchema?: z.Schema) => {
	return z.object({
		data: DataSchema ? DataSchema : z.null(),
		error: z.null(),
		timestamp: z.date(),
	});
};

export const ErrorSchema = z.object({
	data: z.null(),
	error: z.object({
		name: z.string(),
		message: z.string(),
	}),
	timestamp: z.date(),
});
