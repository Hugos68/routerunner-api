import { eq } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";

export function createFilterConditions(
	filters: Record<string, unknown>,
	// biome-ignore lint/suspicious/noExplicitAny: The generic is not relevant
	table: PgTableWithColumns<any>,
) {
	return (
		Object.entries(filters)
			.filter(([_, value]) => value !== undefined)
			// biome-ignore lint/suspicious/noExplicitAny: The generic is not relevant
			.map(([key, value]) => eq(table[key as any], value))
	);
}
