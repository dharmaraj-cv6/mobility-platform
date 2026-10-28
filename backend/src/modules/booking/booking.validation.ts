import { z } from "zod";

// ============================================================
// CREATE BOOKING
// ============================================================

export const createBookingValidation = z.object({
  serviceType: z.string().min(1),

  rideType: z.enum([
    "RIDE_NOW",
    "RIDE_LATER",
    "JOIN_RIDE",
  ]),

  pickup: z.object({
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().optional(),
  }),

  destination: z.object({
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().optional(),
  }),

  distanceKm: z.number().nonnegative(),

  estimatedDurationMinutes: z
    .number()
    .nonnegative(),
});