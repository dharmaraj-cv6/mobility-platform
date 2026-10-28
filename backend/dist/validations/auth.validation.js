import { z } from "zod";
export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .max(100),
    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    role: z.enum([
        "PASSENGER",
        "DRIVER",
    ]),
});
export const loginSchema = z.object({
    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
});
