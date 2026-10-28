import { z } from "zod";

export const drivingExperienceSchema = z.object({
  experience: z.string().min(1, "Please select your driving experience"),

  workedPlatforms: z.array(z.string()).optional(),

  languages: z.array(z.string()).optional(),
});