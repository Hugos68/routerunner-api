import { describe, expect, test } from "bun:test";
import app from "../src";
import type { User } from "../src/database/tables/users";

test("Password is excluded from the GET user response", async () => {
	const response = await app.request("/api/v1/users/1");
	const data = await response.json();

	expect(response.status).toBe(200);
	expect(data.value.at(0).password).not.toBeDefined();
});

test("Password is excluded from the POST user response", async () => {
	const response = await app.request("/api/v1/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: "test@gmail.com",
			password: "password",
		}),
	});
	expect(response.status).toBe(201);
	expect(response.body).not.toContain("password");
});

test("Password is excluded from the PATCH user response", async () => {
	const response = await app.request("/api/v1/users/1", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: "test@gmail.com",
			password: "password",
		}),
	});
	expect(response.status).toBe(200);
	expect(response.body).not.toContain("password");
});

test("Password is excluded from the GET users response", async () => {
	const response = await app.request("/api/v1/users");
	expect(response.status).toBe(200);
	const data = await response.json();
	expect(data.value.at(0).password).not.toBeDefined();
});
