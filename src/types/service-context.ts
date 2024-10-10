import type { Environment } from "./environment.ts";

export interface ServiceContext {
	session: Environment["Variables"]["session"];
}
