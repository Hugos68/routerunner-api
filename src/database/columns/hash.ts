import { customType } from "drizzle-orm/pg-core";
import { HASH_CONFIG } from "../../utility/constants.ts";

export const hash = customType<{ data: string }>({
	dataType() {
		return "text";
	},
	toDriver: (value) => {
		return Bun.password.hashSync(value, HASH_CONFIG);
	},
});
