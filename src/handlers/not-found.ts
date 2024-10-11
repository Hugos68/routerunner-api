import type { NotFoundHandler } from "hono";
import { ResourceNotFoundError } from "../utility/errors.ts";

export const notFound: NotFoundHandler = () => {
	throw new ResourceNotFoundError();
};
