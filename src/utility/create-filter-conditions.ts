import { eq, getTableColumns, getTableName } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { InvalidFilterError } from "./errors";

export function create_filter_conditions<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TTable extends PgTableWithColumns<any>,
>(filters: Record<string, unknown>, table: TTable) {
	const columns = getTableColumns(table);
	for (const column of Object.keys(filters)) {
		if (!(column in columns)) {
			throw new InvalidFilterError(column, getTableName(table));
		}
	}
	return Object.entries(filters)
		.filter(([_, value]) => value !== undefined)
		.map(([key, value]) => eq(table[key as keyof TTable], value));
}
