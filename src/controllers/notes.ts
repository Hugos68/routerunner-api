import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	CreateNoteSchema,
	NoteParamsSchema,
	NoteQuerySchema,
	NoteSchema,
} from "../schemas/notes.ts";
import {
	createNote,
	deleteNote,
	getNote,
	getNotes,
	updateNote,
} from "../services/notes.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse, createOkSchema } from "../utility/response.ts";

const app = new OpenAPIHono<Environment>();

app.openapi(
	createRoute({
		tags: ["notes"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateNoteSchema,
					},
				},
				description: "Note to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(NoteSchema),
					},
				},
				description: "Note created",
			},
			...createErrorResponses("Note"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const noteToCreate = c.req.valid("json");
		const note = await createNote(actor, noteToCreate);
		return c.json(RouterunnerResponse.ok(note), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["notes"],
		method: "get",
		path: "/",
		request: {
			query: NoteQuerySchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(NoteSchema),
					},
				},
				description: "Note found",
			},
			...createErrorResponses("Note"),
		},
	}),
	async (c) => {
		const notes = await getNotes(c.get("actor"));
		return c.json(RouterunnerResponse.ok(notes));
	},
);

app.openapi(
	createRoute({
		tags: ["notes"],
		method: "get",
		path: "/:id",
		request: {
			params: NoteParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(NoteSchema),
					},
				},
				description: "Note found",
			},
			...createErrorResponses("Note"),
		},
	}),
	async (c) => {
		const note = await getNote(c.get("actor"), c.req.param("id"));
		return c.json(RouterunnerResponse.ok(note));
	},
);

app.openapi(
	createRoute({
		tags: ["notes"],
		method: "put",
		path: "/:id",
		request: {
			params: NoteParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateNoteSchema,
					},
				},
				description: "Note to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(NoteSchema),
					},
				},
				description: "Note updated",
			},
			...createErrorResponses("Note"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const noteToUpdate = c.req.valid("json");
		const note = await updateNote(actor, c.req.param("id"), noteToUpdate);
		return c.json(RouterunnerResponse.ok(note));
	},
);

app.openapi(
	createRoute({
		tags: ["notes"],
		method: "delete",
		path: "/:id",
		request: {
			params: NoteParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(NoteSchema),
					},
				},
				description: "Note found",
			},
			...createErrorResponses("Note"),
		},
	}),
	async (c) => {
		const note = await deleteNote(c.get("actor"), c.req.param("id"));
		return c.json(RouterunnerResponse.ok(note));
	},
);

export default app;
