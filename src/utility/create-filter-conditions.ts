import { eq, getTableColumns, getTableName } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { InvalidFilterError } from "./errors.ts";

export function createFilterCondition(
	filters: Record<string, unknown>,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	table: PgTableWithColumns<any>,
) {
	const columns = getTableColumns(table);
	for (const column of Object.keys(filters)) {
		if (!(column in columns)) {
			throw new InvalidFilterError(column, getTableName(table));
		}
	}
	return (
		Object.entries(filters)
			.filter(([_, value]) => value !== undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			.map(([key, value]) => eq(table[key as any], value))
	);
}
