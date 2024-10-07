import { eq } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import { type BaseSchema, parse } from "valibot";

export function create_filter_conditions<
	TSchema extends BaseSchema,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	TTable extends PgTableWithColumns<any>,
>(filters: Record<string, unknown>, Schema: TSchema, table: TTable) {
	return Object.entries(parse(Schema, filters))
		.filter(([_, value]) => value !== undefined)
		.map(([key, value]) => eq(table[key as keyof TTable], value));
}
