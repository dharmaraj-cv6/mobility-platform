import prisma from "../../../config/prisma.js";
// ============================================================
// GET USERS
// ============================================================
export const getUsers = async () => {
    return await prisma.user.findMany({
        orderBy: {
            id: "desc",
        },
        select: {
            id: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
            driverProfile: {
                select: {
                    id: true,
                    driverStatus: true,
                    onboardingCompleted: true,
                    availability: {
                        select: {
                            isOnline: true,
                        },
                    },
                },
            },
        },
    });
};
// ============================================================
// GET USER
// ============================================================
export const getUserById = async (userId) => {
    return await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
            driverProfile: {
                select: {
                    id: true,
                    driverStatus: true,
                    onboardingCompleted: true,
                    availability: {
                        select: {
                            isOnline: true,
                        },
                    },
                },
            },
        },
    });
};
// ============================================================
// UPDATE ACCOUNT ACTIVE STATUS
//
// This controls whether the user account itself is active.
// It is separate from driver online/offline availability.
// ============================================================
export const updateUserActiveStatus = async (userId, isActive) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    });
    if (!user) {
        throw new Error("User not found.");
    }
    return await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive,
        },
        select: {
            id: true,
            email: true,
            phone: true,
            isActive: true,
        },
    });
};
// ============================================================
// UPDATE DRIVER ONLINE / OFFLINE
//
// IMPORTANT:
// This changes DriverAvailability only.
//
// It does NOT:
// - create a booking
// - create a reservation
// - affect watcher sessions
// - change driver verification
// - change onboarding
// ============================================================
export const updateDriverOnlineStatus = async (userId, isOnline) => {
    const driver = await prisma.driverProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
            driverStatus: true,
            onboardingCompleted: true,
            availability: {
                select: {
                    id: true,
                    isOnline: true,
                },
            },
        },
    });
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    if (driver.driverStatus !==
        "VERIFIED") {
        throw new Error("Only verified drivers can be controlled.");
    }
    if (driver.onboardingCompleted !==
        true) {
        throw new Error("Driver onboarding is not completed.");
    }
    if (!driver.availability) {
        throw new Error("Driver availability record not found.");
    }
    return await prisma.driverAvailability.update({
        where: {
            id: driver.availability.id,
        },
        data: {
            isOnline,
        },
        select: {
            id: true,
            isOnline: true,
            driverProfileId: true,
        },
    });
};
// ============================================================
// FORCE DRIVER OFFLINE
//
// Used when Admin disables a driver's account.
// ============================================================
export const deactivateDriver = async (userId) => {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                isActive: true,
                driverProfile: {
                    select: {
                        id: true,
                        availability: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new Error("User not found.");
        }
        await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                isActive: false,
            },
        });
        if (user.driverProfile
            ?.availability) {
            await tx.driverAvailability.update({
                where: {
                    id: user.driverProfile
                        .availability.id,
                },
                data: {
                    isOnline: false,
                },
            });
        }
        return {
            userId,
            isActive: false,
            isOnline: false,
        };
    });
};
// ============================================================
// ACTIVATE USER
// ============================================================
export const activateUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
        },
    });
    if (!user) {
        throw new Error("User not found.");
    }
    return await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive: true,
        },
        select: {
            id: true,
            email: true,
            phone: true,
            isActive: true,
        },
    });
};
