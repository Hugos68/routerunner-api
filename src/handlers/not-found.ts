import type { NotFoundHandler } from "hono";
import { NotFoundError } from "../utility/errors.js";

export const notFound: NotFoundHandler = () => {
	throw new NotFoundError();
};
