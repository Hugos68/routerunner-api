import type { z } from "zod";
import type {
	CreateTripSchema,
	TripSchema,
	UpdateTripSchema,
} from "../schemas/trips.ts";

export type Trip = z.infer<typeof TripSchema>;
export type TripToCreate = z.infer<typeof CreateTripSchema>;
export type TripToUpdate = z.infer<typeof UpdateTripSchema>;
