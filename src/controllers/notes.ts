import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationHook } from "../handlers/validation-hook.ts";
import {
	CreateNoteSchema,
	NoteParamsSchema,
	NoteQuerySchema,
	NoteSchema,
	UpdateNoteSchema,
} from "../schemas/notes.ts";
import { createOkSchema } from "../schemas/responses.ts";
import {
	createNote,
	deleteNote,
	getNote,
	getNotes,
	updateNote,
} from "../services/notes.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse } from "../utility/routerunner-response.ts";

const app = new OpenAPIHono<Environment>({ defaultHook: validationHook });

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
						schema: createOkSchema(NoteSchema.array()),
					},
				},
				description: "Notes found",
			},
			...createErrorResponses("Note"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const query = c.req.valid("query");
		const notes = await getNotes(actor, query);
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
		const actor = c.get("actor");
		const id = c.req.param("id");
		const note = await getNote(actor, id);
		return c.json(RouterunnerResponse.ok(note));
	},
);

app.openapi(
	createRoute({
		tags: ["notes"],
		method: "patch",
		path: "/:id",
		request: {
			params: NoteParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateNoteSchema,
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
		const id = c.req.param("id");
		const noteToUpdate = c.req.valid("json");
		const note = await updateNote(actor, id, noteToUpdate);
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
		const actor = c.get("actor");
		const id = c.req.param("id");
		const note = await deleteNote(actor, id);
		return c.json(RouterunnerResponse.ok(note));
	},
);

export default app;
