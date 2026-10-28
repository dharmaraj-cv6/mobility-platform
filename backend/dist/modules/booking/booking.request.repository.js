import prisma from "../../config/prisma.js";
// ============================================================
// SEND REQUEST TO DRIVER
// ============================================================
export const sendRequestToDriver = async (bookingId, driverProfileId) => {
    // ----------------------------------------------------------
    // Find DriverProfile
    // ----------------------------------------------------------
    const driver = await prisma.driverProfile.findUnique({
        where: {
            id: driverProfileId,
        },
        select: {
            id: true,
            userId: true,
        },
    });
    if (!driver) {
        throw new Error("Driver not found.");
    }
    // ----------------------------------------------------------
    // Assign driver to booking
    // ----------------------------------------------------------
    return await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            // Booking.driverId = User.id
            driverId: driver.userId,
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
    // ----------------------------------------------------------
    // Find driver
    // ----------------------------------------------------------
    const driver = await prisma.driverProfile.findUnique({
        where: {
            id: driverProfileId,
        },
        select: {
            id: true,
            userId: true,
            driverStatus: true,
            onboardingCompleted: true,
            user: {
                select: {
                    id: true,
                    isActive: true,
                },
            },
            availability: {
                select: {
                    id: true,
                    driverProfileId: true,
                    isOnline: true,
                    reservedUntil: true,
                    reservedByBookingId: true,
                },
            },
            Vehicle: {
                where: {
                    isActive: true,
                    verificationStatus: "APPROVED",
                },
                select: {
                    id: true,
                },
                take: 1,
            },
        },
    });
    if (!driver) {
        throw new Error("Driver not found.");
    }
    // ----------------------------------------------------------
    // DRIVER STATUS
    // ----------------------------------------------------------
    if (driver.driverStatus !== "VERIFIED") {
        throw new Error("Driver is not verified.");
    }
    // ----------------------------------------------------------
    // ONBOARDING
    // ----------------------------------------------------------
    if (!driver.onboardingCompleted) {
        throw new Error("Driver onboarding is not completed.");
    }
    // ----------------------------------------------------------
    // USER ACTIVE
    // ----------------------------------------------------------
    if (!driver.user?.isActive) {
        throw new Error("Driver account is not active.");
    }
    // ----------------------------------------------------------
    // ONLINE
    // ----------------------------------------------------------
    if (!driver.availability?.isOnline) {
        throw new Error("Driver is no longer online.");
    }
    // ----------------------------------------------------------
    // APPROVED VEHICLE
    // ----------------------------------------------------------
    if (driver.Vehicle.length === 0) {
        throw new Error("Driver has no approved active vehicle.");
    }
    // ----------------------------------------------------------
    // EXISTING RESERVATION
    // ----------------------------------------------------------
    const existingReservation = driver.availability.reservedUntil;
    if (existingReservation &&
        existingReservation > now &&
        driver.availability.reservedByBookingId !==
            bookingId) {
        throw new Error("Driver is currently reserved for another passenger.");
    }
    // ----------------------------------------------------------
    // RESERVE DRIVER
    // ----------------------------------------------------------
    await prisma.driverAvailability.update({
        where: {
            driverProfileId,
        },
        data: {
            reservedUntil: reservationUntil,
            reservedByBookingId: bookingId,
        },
    });
    // ----------------------------------------------------------
    // SAVE RESERVATION ON BOOKING
    // ----------------------------------------------------------
    return await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            // Booking.driverId requires User.id
            driverId: driver.userId,
            reservedDriverId: driverProfileId,
            reservedAt: now,
            reservationUntil,
            status: "REQUEST_SENT",
        },
    });
};
