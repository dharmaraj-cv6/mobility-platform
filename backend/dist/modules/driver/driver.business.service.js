import prisma from "../../config/prisma.js";
import { findDriverServices, findDriverService, upsertDriverService, updateDriverServiceFare, deleteDriverService, } from "./driver.service.repository.js";
// =====================================================
// DRIVER BUSINESS SERVICE
//
// Ownership is always resolved from the authenticated
// User ID:
//
// JWT -> req.user.id
//     -> DriverProfile.userId
//     -> DriverProfile.id
//     -> DriverService.driverId
//
// No driverId comes from the frontend.
// =====================================================
// =====================================================
// DRIVER PROFILE FROM AUTHENTICATED USER
// =====================================================
const getDriverProfile = async (userId) => {
    const driverProfile = await prisma.driverProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
            userId: true,
            driverStatus: true,
        },
    });
    if (!driverProfile) {
        throw new Error("Driver profile not found.");
    }
    return driverProfile;
};
// =====================================================
// VERIFIED DRIVER ONLY
// =====================================================
const requireVerifiedDriver = async (userId) => {
    const driverProfile = await getDriverProfile(userId);
    if (driverProfile.driverStatus !==
        "VERIFIED") {
        throw new Error("After verification, you can create My Service.");
    }
    return driverProfile;
};
// =====================================================
// VALIDATE SERVICE TYPE
//
// These must match the actual Prisma enum exactly.
// =====================================================
const isDriverServiceType = (value) => {
    return (value === "CITYRIDES" ||
        value === "CORPORATE" ||
        value === "SCHOOL" ||
        value === "CARGO" ||
        value === "TOURIST" ||
        value === "YATRA");
};
// =====================================================
// VALIDATE FARE
// =====================================================
const validateFare = (fare) => {
    if (!fare ||
        typeof fare !== "object") {
        throw new Error("Fare details are required.");
    }
    const data = fare;
    const dayFare = data.dayFare;
    const nightFare = data.nightFare;
    if (!dayFare ||
        typeof dayFare !==
            "object") {
        throw new Error("Day fare details are required.");
    }
    if (!nightFare ||
        typeof nightFare !==
            "object") {
        throw new Error("Night fare details are required.");
    }
    const day = dayFare;
    const night = nightFare;
    const minimumFare = Number(day.minimumFare);
    const perKm = Number(day.perKm);
    const adjustment = Number(night.adjustment);
    if (!Number.isFinite(minimumFare) ||
        minimumFare <= 0) {
        throw new Error("Day minimum fare must be greater than 0.");
    }
    if (!Number.isFinite(perKm) ||
        perKm <= 0) {
        throw new Error("Day per-kilometre fare must be greater than 0.");
    }
    if (!Number.isFinite(adjustment) ||
        adjustment < 0 ||
        adjustment > 100) {
        throw new Error("Night fare adjustment must be between 0 and 100.");
    }
    return {
        dayFare: {
            minimumFare,
            perKm,
        },
        nightFare: {
            adjustment,
        },
    };
};
// =====================================================
// GET MY SERVICES
//
// Pending drivers can read their own existing records.
// Create/update/delete requires VERIFIED.
// =====================================================
export const getMyServices = async (userId) => {
    const driverProfile = await getDriverProfile(userId);
    return findDriverServices(driverProfile.id);
};
// =====================================================
// CREATE / SAVE MY SERVICE
// =====================================================
export const createMyService = async (userId, serviceType, fare) => {
    const driverProfile = await requireVerifiedDriver(userId);
    if (!isDriverServiceType(serviceType)) {
        throw new Error("Invalid driver service type.");
    }
    const validatedFare = validateFare(fare);
    return upsertDriverService(driverProfile.id, serviceType, validatedFare);
};
// =====================================================
// UPDATE MY SERVICE FARE
// =====================================================
export const updateMyServiceFare = async (userId, serviceId, fare) => {
    const driverProfile = await requireVerifiedDriver(userId);
    const existing = await findDriverService(driverProfile.id, serviceId);
    if (!existing) {
        throw new Error("Driver service not found.");
    }
    const validatedFare = validateFare(fare);
    const result = await updateDriverServiceFare(driverProfile.id, serviceId, validatedFare);
    if (result.count === 0) {
        throw new Error("Unable to update driver service fare.");
    }
    return findDriverService(driverProfile.id, serviceId);
};
// =====================================================
// DELETE MY SERVICE
// =====================================================
export const removeMyService = async (userId, serviceId) => {
    const driverProfile = await requireVerifiedDriver(userId);
    const existing = await findDriverService(driverProfile.id, serviceId);
    if (!existing) {
        throw new Error("Driver service not found.");
    }
    const result = await deleteDriverService(driverProfile.id, serviceId);
    if (result.count === 0) {
        throw new Error("Unable to remove driver service.");
    }
    return {
        id: serviceId,
        removed: true,
    };
};
