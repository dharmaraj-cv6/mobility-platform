import { z } from "zod";

export const addVehicleSchema =
  z.object({
    vehicleType: z.enum([
      "BIKE",
      "AUTO",
      "CAB_4",
      "CAB_5",
      "CAB_7",
      "CAB_9",
      "MINI_BUS",
      "BUS",
      "LCV",
      "HCV",
    ]),

    brand: z
      .string()
      .trim()
      .min(
        1,
        "Vehicle brand is required."
      ),

    model: z
      .string()
      .trim()
      .min(
        1,
        "Vehicle model is required."
      ),

    registrationNumber: z
      .string()
      .trim()
      .min(
        1,
        "Registration number is required."
      )
      .transform((value) =>
        value.toUpperCase()
      ),

    manufacturingYear: z.coerce
      .number()
      .int()
      .min(
        1900,
        "Invalid manufacturing year."
      )
      .max(
        new Date().getFullYear(),
        "Manufacturing year cannot be in the future."
      ),

    fuelType: z
      .string()
      .trim()
      .min(
        1,
        "Fuel type is required."
      ),

    seatCapacity: z.coerce
      .number()
      .int()
      .min(
        1,
        "Seat capacity must be at least 1."
      ),

    color: z
      .string()
      .trim()
      .min(
        1,
        "Vehicle color is required."
      ),

    isDefault: z
      .boolean()
      .optional()
      .default(true),
  });