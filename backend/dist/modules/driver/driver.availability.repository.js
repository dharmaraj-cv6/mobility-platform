import prisma from "../../config/prisma.js";
import { DriverStatus, VerificationStatus, } from "@prisma/client";
// ============================================================
// GET DRIVER AVAILABILITY
// ============================================================
export const getAvailability = async (driverProfileId) => {
    return prisma.driverAvailability.findUnique({
        where: {
            driverProfileId,
        },
    });
};
// ============================================================
// UPDATE ONLINE / OFFLINE
//
// IMPORTANT:
// This is the ONLY operation that changes isOnline.
//
// GPS/location updates must NEVER make a driver online.
// ============================================================
export const updateAvailability = async (driverProfileId, isOnline) => {
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
//
// IMPORTANT:
// This updates GPS information only.
//
// It NEVER changes isOnline.
// ============================================================
export const updateLocation = async (driverProfileId, latitude, longitude) => {
    const existing = await prisma.driverAvailability.findUnique({
        where: {
            driverProfileId,
        },
    });
    // ----------------------------------------------------------
    // NO AVAILABILITY RECORD
    //
    // GPS must NEVER automatically make driver online.
    // ----------------------------------------------------------
    if (!existing) {
        return prisma.driverAvailability.create({
            data: {
                driverProfileId,
                isOnline: false,
                currentLatitude: latitude,
                currentLongitude: longitude,
                lastSeen: new Date(),
            },
        });
    }
    // ----------------------------------------------------------
    // EXISTING RECORD
    //
    // Preserve the current online/offline state.
    // ----------------------------------------------------------
    return prisma.driverAvailability.update({
        where: {
            driverProfileId,
        },
        data: {
            currentLatitude: latitude,
            currentLongitude: longitude,
            lastSeen: new Date(),
        },
    });
};
// ============================================================
// GET ALL ELIGIBLE ONLINE DRIVERS
//
// Driver must satisfy:
//
// 1. User account active
// 2. Driver VERIFIED
// 3. Onboarding completed
// 4. Driver ONLINE
// 5. GPS coordinates available
// 6. At least one active APPROVED vehicle
//
// IMPORTANT:
// There is NO take: 1 here.
// All eligible online drivers are returned.
// ============================================================
export const getOnlineDrivers = async () => {
    return prisma.driverProfile.findMany({
        where: {
            // ------------------------------------------------------
            // DRIVER APPROVAL
            // ------------------------------------------------------
            driverStatus: DriverStatus.VERIFIED,
            onboardingCompleted: true,
            // ------------------------------------------------------
            // USER ACCOUNT
            // ------------------------------------------------------
            user: {
                isActive: true,
            },
            // ------------------------------------------------------
            // DRIVER AVAILABILITY
            // ------------------------------------------------------
            availability: {
                isOnline: true,
                currentLatitude: {
                    not: null,
                },
                currentLongitude: {
                    not: null,
                },
            },
            // ------------------------------------------------------
            // APPROVED ACTIVE VEHICLE
            // ------------------------------------------------------
            Vehicle: {
                some: {
                    isActive: true,
                    verificationStatus: VerificationStatus.APPROVED,
                },
            },
        },
        include: {
            // ------------------------------------------------------
            // AVAILABILITY
            // ------------------------------------------------------
            availability: true,
            // ------------------------------------------------------
            // USER
            // ------------------------------------------------------
            user: {
                select: {
                    id: true,
                    fullName: true,
                    isActive: true,
                    businessName: true,
                },
            },
            // ------------------------------------------------------
            // ACTIVE APPROVED VEHICLES
            //
            // Default vehicle comes first.
            // ------------------------------------------------------
            Vehicle: {
                where: {
                    isActive: true,
                    verificationStatus: VerificationStatus.APPROVED,
                },
                orderBy: [
                    {
                        isDefault: "desc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],
            },
            // ------------------------------------------------------
            // DRIVER SERVICES
            // ------------------------------------------------------
            services: true,
        },
        // --------------------------------------------------------
        // STABLE ORDER
        // --------------------------------------------------------
        orderBy: {
            id: "asc",
        },
    });
};
