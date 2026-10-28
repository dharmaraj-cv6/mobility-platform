import prisma from "../../config/prisma.js";
import { UserRole, DriverStatus, } from "@prisma/client";
// ========================================
// FIND DRIVER BY AADHAAR
// ========================================
export const findByAadhaar = async (aadhaar) => {
    return prisma.driverProfile.findUnique({
        where: {
            aadhaar,
        },
    });
};
// ========================================
// FIND DRIVER BY LICENCE
// ========================================
export const findByLicence = async (licenceNumber) => {
    return prisma.driverProfile.findUnique({
        where: {
            licenceNumber,
        },
    });
};
// ========================================
// FIND VEHICLE BY REGISTRATION
// ========================================
export const findVehicleByRegistration = async (registrationNumber) => {
    return prisma.vehicle.findUnique({
        where: {
            registrationNumber,
        },
    });
};
// ========================================
// FIND DRIVER BY USER ID
// ========================================
export const findDriverByUserId = async (userId) => {
    return prisma.driverProfile.findUnique({
        where: {
            userId,
        },
    });
};
// ========================================
// GET DRIVER ONBOARDING STEP
// ========================================
export const getDriverOnboardingStep = async (userId) => {
    return prisma.driverProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
            onboardingStep: true,
        },
    });
};
// ========================================
// CREATE DRIVER REGISTRATION
// ========================================
export const createDriverRegistration = async (userId, data) => {
    return prisma.$transaction(async (tx) => {
        // ------------------------------------
        // Driver Profile
        // ------------------------------------
        const driverProfile = await tx.driverProfile.create({
            data: {
                userId,
                dob: new Date(data.dob),
                gender: data.gender,
                aadhaar: data.aadhaar,
                licenceNumber: data.licenceNumber,
                address: data.address,
                district: data.district,
                state: data.state,
                pincode: data.pincode,
                businessType: data.businessType,
                driverStatus: DriverStatus.PENDING,
                onboardingStep: 1,
                onboardingCompleted: false,
            },
        });
        // ------------------------------------
        // Driver Experience
        // ------------------------------------
        await tx.driverExperience.create({
            data: {
                driverProfileId: driverProfile.id,
                experience: data.experience,
                workedPlatforms: data.workedPlatforms ?? [],
                languages: data.languages ?? [],
            },
        });
        // ------------------------------------
        // Change User Role
        // ------------------------------------
        await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                role: UserRole.DRIVER,
            },
        });
        return driverProfile;
    });
};
// ========================================
// FIND DRIVER
// ========================================
export const findDriverById = async (id) => {
    return prisma.driverProfile.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            experience: true,
            Vehicle: true,
            documents: true,
            services: true,
        },
    });
};
// ========================================
// UPDATE DRIVER
// ========================================
export const updateDriver = async (id, data) => {
    return prisma.driverProfile.update({
        where: {
            id,
        },
        data,
    });
};
// ========================================
// GET DRIVER SERVICES
// ========================================
export const findDriverServices = async (driverProfileId) => {
    return prisma.driverService.findMany({
        where: {
            driverId: driverProfileId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
// ========================================
// UPDATE DRIVER SERVICES
// ========================================
export const updateDriverServices = async (driverProfileId, services) => {
    return prisma.$transaction(async (tx) => {
        // ------------------------------------
        // Remove previous selections
        // ------------------------------------
        await tx.driverService.deleteMany({
            where: {
                driverId: driverProfileId,
            },
        });
        // ------------------------------------
        // Save selected services
        // ------------------------------------
        if (services.length > 0) {
            await tx.driverService.createMany({
                data: services.map((service) => ({
                    driverId: driverProfileId,
                    serviceType: service,
                })),
            });
        }
        // ------------------------------------
        // Move to Step 3
        // ------------------------------------
        const driverProfile = await tx.driverProfile.update({
            where: {
                id: driverProfileId,
            },
            data: {
                onboardingStep: 3,
                onboardingCompleted: false,
            },
            include: {
                services: true,
            },
        });
        return driverProfile;
    });
};
// ========================================
// UPDATE DRIVER DETAILS
// ========================================
export const updateDriverDetails = async (driverProfileId, data) => {
    return prisma.$transaction(async (tx) => {
        // ------------------------------------
        // Update Driver Profile
        // ------------------------------------
        await tx.driverProfile.update({
            where: {
                id: driverProfileId,
            },
            data: {
                dob: new Date(data.dob),
                gender: data.gender,
                aadhaar: data.aadhaar,
                licenceNumber: data.licenceNumber,
                address: data.address,
                district: data.district,
                state: data.state,
                pincode: data.pincode,
                onboardingStep: 5,
                onboardingCompleted: false,
            },
        });
        // ------------------------------------
        // Update Driver Experience
        // ------------------------------------
        await tx.driverExperience.upsert({
            where: {
                driverProfileId,
            },
            update: {
                experience: data.experience,
                workedPlatforms: data.workedPlatforms ?? [],
                languages: data.languages ?? [],
            },
            create: {
                driverProfileId,
                experience: data.experience,
                workedPlatforms: data.workedPlatforms ?? [],
                languages: data.languages ?? [],
            },
        });
        // ------------------------------------
        // Return Updated Driver
        // ------------------------------------
        return tx.driverProfile.findUnique({
            where: {
                id: driverProfileId,
            },
            include: {
                experience: true,
                services: true,
                Vehicle: true,
            },
        });
    });
};
// ========================================
// SUBMIT DRIVER ONBOARDING
// ========================================
export const submitDriverOnboarding = async (driverProfileId) => {
    return prisma.driverProfile.update({
        where: {
            id: driverProfileId,
        },
        data: {
            onboardingStep: 7,
            onboardingCompleted: true,
            driverStatus: DriverStatus.PENDING,
        },
        include: {
            user: true,
            experience: true,
            Vehicle: true,
            documents: true,
            services: true,
        },
    });
};
// ========================================
// GET NEARBY ONLINE RIDERS
// ========================================
//
// Used by Driver Dashboard.
//
// Checks:
// 1. Driver is online
// 2. Driver has recent lastSeen
// 3. Driver has current latitude
// 4. Driver has current longitude
//
// Distance is calculated in service layer.
// ========================================
export const findNearbyOnlineDrivers = async (sessionCutoff) => {
    return prisma.driverProfile.findMany({
        where: {
            availability: {
                isOnline: true,
                lastSeen: {
                    gte: sessionCutoff,
                },
                currentLatitude: {
                    not: null,
                },
                currentLongitude: {
                    not: null,
                },
            },
        },
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
            availability: {
                select: {
                    isOnline: true,
                    lastSeen: true,
                    currentLatitude: true,
                    currentLongitude: true,
                },
            },
            Vehicle: {
                where: {
                    isActive: true,
                },
                orderBy: [
                    {
                        isDefault: "desc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
                take: 1,
                select: {
                    id: true,
                    registrationNumber: true,
                    vehicleType: true,
                    make: true,
                    model: true,
                },
            },
            services: {
                select: {
                    serviceType: true,
                },
            },
        },
    });
};
