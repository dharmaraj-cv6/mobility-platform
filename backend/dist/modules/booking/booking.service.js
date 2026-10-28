import prisma from "../../config/prisma.js";
// ============================================================
// CREATE BOOKING
// ============================================================
export const createBooking = async (data) => {
    return await prisma.booking.create({
        data,
    });
};
// ============================================================
// GET BOOKING
// ============================================================
export const getBooking = async (id) => {
    return await prisma.booking.findUnique({
        where: {
            id,
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
    // CHECK BOOKING
    // ==========================================================
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
    if (!booking) {
        throw new Error("Booking not found.");
    }
    // ==========================================================
    // CHECK DRIVER
    // ==========================================================
    const driver = await prisma.driverProfile.findUnique({
        where: {
            id: driverProfileId,
        },
        include: {
            user: true,
            availability: true,
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
    // DRIVER MUST BE VERIFIED
    // ==========================================================
    if (driver.driverStatus !==
        "VERIFIED") {
        throw new Error("Driver is not verified.");
    }
    // ==========================================================
    // ONBOARDING MUST BE COMPLETE
    // ==========================================================
    if (driver.onboardingCompleted !==
        true) {
        throw new Error("Driver onboarding is not completed.");
    }
    // ==========================================================
    // USER ACCOUNT MUST BE ACTIVE
    // ==========================================================
    if (driver.user?.isActive !== true) {
        throw new Error("Driver account is not active.");
    }
    // ==========================================================
    // DRIVER MUST BE ONLINE
    // ==========================================================
    if (driver.availability?.isOnline !==
        true) {
        throw new Error("Driver is no longer online.");
    }
    // ==========================================================
    // DRIVER MUST HAVE APPROVED ACTIVE VEHICLE
    // ==========================================================
    if (!driver.Vehicle ||
        driver.Vehicle.length === 0) {
        throw new Error("Driver has no approved active vehicle.");
    }
    // ==========================================================
    // CHECK WHETHER DRIVER IS ALREADY RESERVED
    //
    // We check all active bookings for this driver.
    // ==========================================================
    const existingReservation = await prisma.booking.findFirst({
        where: {
            reservedDriverId: driverProfileId,
            reservationUntil: {
                gt: now,
            },
        },
        select: {
            id: true,
            reservationUntil: true,
        },
    });
    if (existingReservation &&
        existingReservation.id !== bookingId) {
        throw new Error("Driver is currently reserved for another passenger.");
    }
    // ==========================================================
    // ATOMIC RESERVATION
    //
    // Only reserve when:
    //
    // 1. This booking exists
    // 2. Driver is not currently reserved
    //    OR previous reservation has expired
    // ==========================================================
    const updated = await prisma.booking.updateMany({
        where: {
            id: bookingId,
            OR: [
                {
                    reservedDriverId: null,
                },
                {
                    reservationUntil: {
                        lte: now,
                    },
                },
                {
                    reservedDriverId: driverProfileId,
                },
            ],
        },
        data: {
            reservedDriverId: driverProfileId,
            reservedAt: now,
            reservationUntil,
        },
    });
    // ==========================================================
    // RESERVATION FAILED
    // ==========================================================
    if (updated.count !== 1) {
        throw new Error("Driver is no longer available. Please select another driver.");
    }
    // ==========================================================
    // RETURN UPDATED BOOKING
    // ==========================================================
    return await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
};
