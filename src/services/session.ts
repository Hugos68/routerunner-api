import { eq } from "drizzle-orm";
import { type Output, pick } from "valibot";
import { database } from "../database/database.js";
import { type Session, session } from "../database/tables/session.js";
import { CreateUserSchema, user } from "../database/tables/user.js";

const CredentialsSchema = pick(CreateUserSchema, ["email", "password"]);

export async function createSession(data: Output<typeof CredentialsSchema>) {
	const user_ = (
		await database.select().from(user).where(eq(user.email, data.email))
	).at(0);

	if (!user_) {
		throw new Error("User not found");
	}

	const matches = await Bun.password.verify(
		data.password,
		user_.password,
		"argon2id",
	);

	if (!matches) {
		throw new Error("Invalid credentials");
	}

	return await database
		.insert(session)
		.values({
			userId: user_.id,
		})
		.returning();
}

export async function getSession(id: Session["id"]) {
	return await database.select().from(session).where(eq(session.id, id));
}

export async function getSessions() {
	return await database.select().from(session);
}

export async function deleteSession(id: Session["id"]) {
	return await database.delete(session).where(eq(session.id, id)).returning();
}
