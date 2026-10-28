import { z } from "zod";

const MAX_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export const documentSchema = z.object({
  profilePhoto: z.any(),
  aadhaar: z.any(),
  drivingLicence: z.any(),
  rcBook: z.any(),
  insurance: z.any(),
  permit: z.any(),
  fitness: z.any(),
  pollution: z.any(),
});