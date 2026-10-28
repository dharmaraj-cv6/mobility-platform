import prisma from "../../config/prisma.js";
// ============================================================
// SEND REQUEST TO DRIVER
// ============================================================
export const sendRequestToDriver = async (bookingId, driverId) => {
    return prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            driverId,
            status: "REQUEST_SENT",
        },
    });
};
// ============================================================
// RESERVE DRIVER FOR 30 SECONDS
// ============================================================
export const reserveDriver = async (bookingId, driverProfileId) => {
    const now = new Date();
    const reservationUntil = new Date(now.getTime() + 30 * 1000);
    // ==========================================================
    // CHECK DRIVER
    // ==========================================================
    const driver = await prisma.driverProfile.findUnique({
        where: {
            id: driverProfileId,
        },
        include: {
            availability: true,
            user: true,
            Vehicle: {
                where: {
                    isActive: true,
                    verificationStatus: "APPROVED",
                },
                take: 1,
            },
            services: true,
        },
    });
    if (!driver) {
        throw new Error("Driver not found.");
    }
    // ==========================================================
    // DRIVER MUST BE ONLINE
    // ==========================================================
    if (driver.availability?.isOnline !== true) {
        throw new Error("Driver is no longer online.");
    }
    // ==========================================================
    // DRIVER MUST BE VERIFIED
    // ==========================================================
    if (driver.driverStatus !== "VERIFIED") {
        throw new Error("Driver is not verified.");
    }
    // ==========================================================
    // ONBOARDING
    // ==========================================================
    if (driver.onboardingCompleted !== true) {
        throw new Error("Driver onboarding is not completed.");
    }
    // ==========================================================
    // ACTIVE USER
    // ==========================================================
    if (driver.user?.isActive !== true) {
        throw new Error("Driver account is not active.");
    }
    // ==========================================================
    // APPROVED VEHICLE
    // ==========================================================
    if (driver.Vehicle.length === 0) {
        throw new Error("Driver has no approved active vehicle.");
    }
    // ==========================================================
    // CHECK EXISTING RESERVATION
    //
    // DriverAvailability.reservedUntil is the
    // source of truth for the 30-second lock.
    // ==========================================================
    const reservedUntil = driver.availability?.reservedUntil;
    if (reservedUntil &&
        reservedUntil > now) {
        throw new Error("Driver is currently reserved for another passenger.");
    }
    // ==========================================================
    // RESERVE DRIVER
    // ==========================================================
    await prisma.driverAvailability.update({
        where: {
            driverProfileId,
        },
        data: {
            reservedUntil,
        },
    });
    // ==========================================================
    // SAVE RESERVATION ON BOOKING
    // ==========================================================
    return prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            reservedDriverId: driverProfileId,
            reservedAt: now,
            reservationUntil,
        },
    });
};
// ============================================================
// UPDATE BOOKING STATUS
// ============================================================
export const updateBookingStatus = async (bookingId, status) => {
    return prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status,
        },
    });
};
