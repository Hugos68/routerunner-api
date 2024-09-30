import { describe, expect, test } from "bun:test";
import app from "../src";

describe("Orders", () => {
	test("GET /orders", async () => {
		const response = await app.request("/api/v1/orders");
		expect(response.status).toBe(200);
	});

	test("GET /orders/:id", async () => {
		const response = await app.request("/api/v1/orders/1");
		expect(response.status).toBe(200);
	});

	test("POST /orders", async () => {
		const response = await app.request("/api/v1/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				quantity: 6,
				packageType: "BP",
				unloadingAddress: "c71ce777-9555-4078-8983-d34745fd5e56",
				unloadingDateTime: "2018-12-10T13:45:00.000Z",
				deliveryInstructions: "de pallet moet ik vak 4 komen te staan",
				status: "OPEN",
			}),
		});

		expect(response.status).toBe(201);
	});

	test("PATCH /orders/:id", async () => {
		const response = await app.request("/api/v1/orders/1", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				quantity: 6,
				packageType: "BP",
				unloadingAddress: "c71ce777-9555-4078-8983-d34745fd5e56",
				unloadingDateTime: "2018-12-10T13:45:00.000Z",
				deliveryInstructions: "de pallet moet ik vak 4 komen te staan",
				status: "GESLOTEN",
			}),
		});

		expect(response.status).toBe(200);
	});

	test("DELETE /orders/:id", async () => {
		const response = await app.request("/api/v1/orders/1", {
			method: "DELETE",
		});

		expect(response.status).toBe(200);
	});
});
