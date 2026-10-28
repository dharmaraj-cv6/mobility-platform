import { z } from "zod";
// ========================================
// DRIVER FARE SETTINGS
// ========================================
export const driverPricingSchema = z.object({
    baseFare: z.coerce
        .number()
        .min(0, "Base fare cannot be negative"),
    pricePerKm: z.coerce
        .number()
        .min(0, "Price per km cannot be negative"),
    minimumFare: z.coerce
        .number()
        .min(0, "Minimum fare cannot be negative"),
    maximumFare: z.coerce
        .number()
        .min(0, "Maximum fare cannot be negative"),
    waitingChargePerMinute: z.coerce
        .number()
        .min(0, "Waiting charge cannot be negative"),
    nightChargePercentage: z.coerce
        .number()
        .min(0, "Night charge cannot be negative")
        .max(100, "Night charge cannot exceed 100%")
        .optional(),
})
    .superRefine((data, ctx) => {
    if (data.maximumFare <
        data.minimumFare) {
        ctx.addIssue({
            code: "custom",
            path: ["maximumFare"],
            message: "Maximum fare must be greater than or equal to minimum fare",
        });
    }
    if (data.baseFare >
        data.maximumFare) {
        ctx.addIssue({
            code: "custom",
            path: ["baseFare"],
            message: "Base fare cannot be greater than maximum fare",
        });
    }
});
