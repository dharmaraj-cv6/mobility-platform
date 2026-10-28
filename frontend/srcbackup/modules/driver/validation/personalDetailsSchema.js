import { z } from "zod";

export const personalDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name is required"),

  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid mobile number"),

  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  dob: z
    .string()
    .min(1, "Date of birth is required"),

  gender: z
    .string()
    .min(1, "Select gender"),

  aadhaar: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar must contain 12 digits"),

  licenceNumber: z
    .string()
    .min(5, "Driving licence number is required"),

  address: z
    .string()
    .min(5, "Address is required"),

  district: z
    .string()
    .min(2, "District is required"),

  state: z
    .string()
    .min(2, "State is required"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Invalid pincode"),
});