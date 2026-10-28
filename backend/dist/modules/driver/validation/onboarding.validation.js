import { z } from "zod";
// =====================================================
// BUSINESS MODEL
// =====================================================
const businessTypeSchema = z.enum([
    "ACTIVE_DRIVER",
    "DRIVER_OWNER",
    "VEHICLE_OWNER",
]);
// =====================================================
// VEHICLE TYPE
// =====================================================
const vehicleTypeSchema = z.enum([
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
]);
// =====================================================
// DRIVER DOCUMENT TYPES
// =====================================================
const driverDocumentTypeSchema = z.enum([
    "PROFILE_PHOTO",
    "AADHAAR",
    "DRIVING_LICENSE",
    "OTHER",
]);
// =====================================================
// VEHICLE DOCUMENT TYPES
// =====================================================
const vehicleDocumentTypeSchema = z.enum([
    "RC_BOOK",
    "INSURANCE",
    "FITNESS",
    "PERMIT",
    "POLLUTION",
    "OTHER",
]);
// =====================================================
// DRIVER
// =====================================================
const driverSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required."),
    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number."),
    businessType: businessTypeSchema,
    dob: z.coerce
        .date()
        .optional(),
    gender: z.string()
        .trim()
        .optional(),
    aadhaar: z.string()
        .trim()
        .optional(),
    licenceNumber: z.string()
        .trim()
        .optional(),
    address: z.string()
        .trim()
        .optional(),
    district: z.string()
        .trim()
        .optional(),
    state: z.string()
        .trim()
        .optional(),
    pincode: z.string()
        .trim()
        .optional(),
});
// =====================================================
// VEHICLE
// =====================================================
const vehicleSchema = z.object({
    vehicleType: vehicleTypeSchema,
    vehicleNumber: z
        .string()
        .trim()
        .min(1, "Vehicle number is required."),
    model: z
        .string()
        .trim()
        .min(1, "Vehicle model is required."),
    seatCapacity: z.coerce
        .number()
        .int()
        .positive("Seating capacity is required."),
    brand: z.string()
        .trim()
        .optional(),
    registrationNumber: z.string()
        .trim()
        .optional(),
    manufacturingYear: z.coerce
        .number()
        .int()
        .optional(),
    fuelType: z.string()
        .trim()
        .optional(),
    color: z.string()
        .trim()
        .optional(),
});
// =====================================================
// DRIVER DOCUMENT
// =====================================================
const driverDocumentSchema = z.object({
    documentType: driverDocumentTypeSchema,
    fileUrl: z
        .string()
        .min(1, "Driver document file is required."),
});
// =====================================================
// VEHICLE DOCUMENT
// =====================================================
const vehicleDocumentSchema = z.object({
    documentType: vehicleDocumentTypeSchema,
    fileUrl: z
        .string()
        .min(1, "Vehicle document file is required."),
});
// =====================================================
// MAIN ONBOARDING SCHEMA
//
// V1 receives only:
// - driver
// - vehicle
//
// Documents are uploaded separately.
// =====================================================
export const onboardingSchema = z.object({
    driver: driverSchema,
    vehicle: vehicleSchema,
});
