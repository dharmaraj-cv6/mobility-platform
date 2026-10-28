import prisma from "../../config/prisma.js";
const ONLINE_SESSION_MINUTES = 45;
// ============================================================
// GET DRIVER PROFILE FROM USER ID
// ============================================================
//
// Authentication gives us User ID.
// DriverAvailability belongs to DriverProfile.
//
// User -> DriverProfile -> DriverAvailability
// ============================================================
const getDriverProfileId = async (userId) => {
    const driverProfile = await prisma.driverProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });
    if (!driverProfile) {
        throw new Error("Driver profile not found.");
    }
    return driverProfile.id;
};
// ============================================================
// GET DRIVER AVAILABILITY
// ============================================================
export const getAvailability = async (userId) => {
    const driverProfileId = await getDriverProfileId(userId);
    return prisma.driverAvailability.findUnique({
        where: {
            driverProfileId,
        },
    });
};
// ============================================================
// UPDATE ONLINE / OFFLINE STATUS
// ============================================================
//
// Online:
// - isOnline = true
// - lastSeen = now
//
// Offline:
// - isOnline = false
// - lastSeen = now
//
// This function controls online status.
//
// No onboarding/service/vehicle checks here.
// ============================================================
export const updateAvailability = async (userId, isOnline) => {
    const driverProfileId = await getDriverProfileId(userId);
    return prisma.driverAvailability.upsert({
        where: {
            driverProfileId,
        },
        create: {
            driverProfileId,
            isOnline,
            lastSeen: new Date(),
        },
        update: {
            isOnline,
            lastSeen: new Date(),
        },
    });
};
// ============================================================
// UPDATE DRIVER LOCATION
// ============================================================
//
// IMPORTANT:
//
// Location update MUST NOT automatically make the driver
// online.
//
// Existing availability:
// - keep current isOnline value
// - update latitude
// - update longitude
// - refresh lastSeen
//
// No availability record:
// - create record as offline
// ============================================================
export const updateLocation = async (userId, latitude, longitude) => {
    const driverProfileId = await getDriverProfileId(userId);
    return prisma.driverAvailability.upsert({
        where: {
            driverProfileId,
        },
        create: {
            driverProfileId,
            isOnline: false,
            currentLatitude: latitude,
            currentLongitude: longitude,
            lastSeen: new Date(),
        },
        update: {
            currentLatitude: latitude,
            currentLongitude: longitude,
            lastSeen: new Date(),
        },
    });
};
// ============================================================
// GET ONLINE DRIVERS
// ============================================================
//
// General availability endpoint.
//
// Only drivers who are:
// - online
// - within the current 45-minute session
//
// are returned.
//
// Booking-specific distance/service filtering belongs to
// booking.selection.repository.ts.
// ============================================================
export const getOnlineDrivers = async () => {
    const now = new Date();
    const sessionCutoff = new Date(now.getTime() -
        ONLINE_SESSION_MINUTES * 60 * 1000);
    return prisma.driverProfile.findMany({
        where: {
            availability: {
                isOnline: true,
                lastSeen: {
                    gte: sessionCutoff,
                },
            },
        },
        include: {
            availability: true,
            user: {
                select: {
                    id: true,
                    fullName: true,
                    isActive: true,
                },
            },
            Vehicle: {
                where: {
                    isActive: true,
                },
                orderBy: {
                    isDefault: "desc",
                },
            },
            services: true,
        },
        orderBy: {
            id: "asc",
        },
    });
};
