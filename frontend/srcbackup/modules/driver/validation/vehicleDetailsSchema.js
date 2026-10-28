import { z } from "zod";

export const vehicleDetailsSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),

  brand: z.string().min(2, "Brand is required"),

  model: z.string().min(2, "Model is required"),

  registrationNumber: z
    .string()
    .min(5, "Registration number is required"),

  manufacturingYear: z.string().min(4),

  fuelType: z.string().min(1),

  seatCapacity: z.string().min(1),

  color: z.string().min(2),
});