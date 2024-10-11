import { ErrorSchema } from "./response.ts";

export function createErrorResponses(resource: string) {
	return {
		400: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Bad request",
		},
		401: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Unauthorized",
		},

		404: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: `${resource} not found`,
		},
		422: {
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
			description: "Unprocessable content",
		},
	};
}
