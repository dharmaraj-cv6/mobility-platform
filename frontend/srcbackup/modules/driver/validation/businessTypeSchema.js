import { z } from "zod";

export const businessTypeSchema = z.object({
  businessType: z.string().min(1, "Please select your business type"),
});