import { z } from "zod";

// ========================================
// DRIVER REGISTRATION
// ========================================

export const registerDriverSchema = z.object({
  dob: z
    .string()
    .min(
      1,
      "Date of birth is required"
    ),

  gender: z
    .string()
    .trim()
    .min(
      1,
      "Gender is required"
    ),

  aadhaar: z
    .string()
    .regex(
      /^\d{12}$/,
      "Aadhaar must contain 12 digits"
    ),

  licenceNumber: z
    .string()
    .trim()
    .min(
      5,
      "Invalid licence number"
    ),

  address: z
    .string()
    .trim()
    .min(
      5,
      "Address must be at least 5 characters"
    ),

  district: z
    .string()
    .trim()
    .min(
      1,
      "District is required"
    ),

  state: z
    .string()
    .trim()
    .min(
      1,
      "State is required"
    ),

  pincode: z
    .string()
    .regex(
      /^\d{6}$/,
      "Pincode must contain 6 digits"
    ),

  businessType: z.enum([
    "ACTIVE_DRIVER",
    "VEHICLE_OWNER",
    "DRIVER_OWNER",
  ]),

  experience: z
    .string()
    .trim()
    .min(
      1,
      "Experience is required"
    ),

  workedPlatforms: z
    .array(z.string())
    .optional(),

  languages: z
    .array(z.string())
    .optional(),
});

// ========================================
// DRIVER REGISTRATION TYPE
// ========================================

export type RegisterDriverInput =
  z.infer<
    typeof registerDriverSchema
  >;

// ========================================
// DRIVER BUSINESS SERVICES
// ========================================

export const driverServicesSchema =
  z.object({
    services: z
      .array(
        z.enum([
          "CITY",
          "CORPORATE",
          "SCHOOL",
          "CARGO",
          "TOURIST",
          "YATRA",
        ])
      )
      .min(
        1,
        "Select at least one business service."
      ),
  });

export type DriverServicesInput =
  z.infer<
    typeof driverServicesSchema
  >;

  // ========================================
// DRIVER DETAILS
// ========================================

export const updateDriverDetailsSchema =
  z.object({
    dob: z
      .string()
      .min(
        1,
        "Date of birth is required"
      ),

    gender: z
      .string()
      .trim()
      .min(
        1,
        "Gender is required"
      ),

    aadhaar: z
      .string()
      .regex(
        /^\d{12}$/,
        "Aadhaar must contain 12 digits"
      ),

    licenceNumber: z
      .string()
      .trim()
      .min(
        5,
        "Invalid licence number"
      ),

    address: z
      .string()
      .trim()
      .min(
        5,
        "Address must be at least 5 characters"
      ),

    district: z
      .string()
      .trim()
      .min(
        1,
        "District is required"
      ),

    state: z
      .string()
      .trim()
      .min(
        1,
        "State is required"
      ),

    pincode: z
      .string()
      .regex(
        /^\d{6}$/,
        "Pincode must contain 6 digits"
      ),

    experience: z
      .string()
      .trim()
      .min(
        1,
        "Experience is required"
      ),

    workedPlatforms: z
      .array(z.string())
      .optional()
      .default([]),

    languages: z
      .array(z.string())
      .optional()
      .default([]),
  });

export type UpdateDriverDetailsInput =
  z.infer<
    typeof updateDriverDetailsSchema
  >;