import { eq, getTableColumns } from "drizzle-orm";
import { database } from "../database/database.js";
import { type User, user } from "../database/tables/user.js";

export async function createUser(data: Omit<User, "id">) {
    return await database
        .insert(user)
        .values({
            ...data,
            password: await Bun.password.hash(data.password, {
                algorithm: "argon2id",
                memoryCost: 19_456,
                timeCost: 2,
            }),
        })
        .returning();
}

export async function getUser(id: User['id']) {
    const { password: _, ...columns } = getTableColumns(user);
    return await database.select(columns).from(user).where(eq(user.id, id));
}

export async function getUsers() {
    const { password: _, ...columns } = getTableColumns(user);
    return await database.select(columns).from(user);
}

export async function updateUser(id: User['id'], data: Partial<Omit<User, "id">>) {
    return await database
        .update(user)
        .set({
            ...(data.password
                ? {
                    ...data,
                    password: await Bun.password.hash(data.password, {
                        algorithm: "argon2id",
                        memoryCost: 19_456,
                        timeCost: 2,
                    }),
                }
                : data),
        })
        .where(eq(user.id, id))
        .returning();
}

export async function deleteUser(id: User['id']) {
    return await database.delete(user).where(eq(user.id, id)).returning();
}
