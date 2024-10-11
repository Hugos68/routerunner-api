import { createSelectSchema } from "drizzle-zod";
import { tripsTable } from "../database/tables/trips.ts";

export const TripSchema = createSelectSchema(tripsTable);
export const CreateTripSchema = TripSchema.omit({ id: true });
export const UpdateTripSchema = CreateTripSchema.partial();
export const TripParamsSchema = TripSchema.pick({ id: true });
export const TripQuerySchema = TripSchema.partial();
