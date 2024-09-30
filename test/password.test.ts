import { expect, test } from "bun:test";
import app from "../src";

test("Password is excluded from the GET user response", async () => {
	const response = await app.request(
		`/api/v1/users/${(await (await app.request("/api/v1/users")).json()).data.at(0).id}`,
	);
	expect(response.status).toBe(200);
	const user = (await response.json()).data.at(0);
	expect(user).not.toHaveProperty("password");
});

// test("Password is excluded from the POST user response", async () => {
// 	const response = await app.request("/api/v1/users", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			email: "test@gmail.com",
// 			password: "password",
// 		}),
// 	});
// 	expect(response.status).toBe(201);
// 	expect(response.body).not.toContain("password");
// });

// test("Password is excluded from the PATCH user response", async () => {
// 	const response = await app.request("/api/v1/users/1", {
// 		method: "PATCH",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			email: "test@gmail.com",
// 			password: "password",
// 		}),
// 	});
// 	expect(response.status).toBe(200);
// 	expect(response.body).not.toContain("password");
// });

// test("Password is excluded from the GET users response", async () => {
// 	const response = await app.request("/api/v1/users");
// 	expect(response.status).toBe(200);
// 	const data = await response.json();
// 	expect(data.value.at(0).password).not.toBeDefined();
// });
