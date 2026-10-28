import prisma from "../../config/prisma.js";
// ============================================================
// PASSENGER CONFIRM BOOKING
// ============================================================
export const confirmBooking = async (bookingId, passengerId) => {
    return prisma.$transaction(async (tx) => {
        const now = new Date();
        const booking = await tx.booking.findUnique({
            where: {
                id: bookingId,
            },
            select: {
                id: true,
                passengerId: true,
                driverId: true,
                status: true,
                enteredAt: true,
                reservationUntil: true,
                decisionUntil: true,
                driverSelectionOrder: true,
                entryType: true,
            },
        });
        if (!booking) {
            throw new Error("Booking not found.");
        }
        if (booking.passengerId !==
            passengerId) {
            throw new Error("You are not allowed to confirm this booking.");
        }
        if (!booking.driverId) {
            throw new Error("No driver is assigned to this booking.");
        }
        if (booking.status !==
            "REQUEST_SENT") {
            throw new Error("This booking is no longer available for confirmation.");
        }
        if (!booking.decisionUntil) {
            throw new Error("Your booking decision window is not available.");
        }
        if (booking.decisionUntil <=
            now) {
            throw new Error("Your decision window has expired. Please choose another driver.");
        }
        const driver = await tx.driverProfile.findFirst({
            where: {
                userId: booking.driverId,
            },
            select: {
                id: true,
                userId: true,
                availability: {
                    select: {
                        id: true,
                        reservedUntil: true,
                        reservedByBookingId: true,
                    },
                },
            },
        });
        if (!driver) {
            throw new Error("Driver not found.");
        }
        const availability = driver.availability;
        if (availability?.reservedByBookingId &&
            availability.reservedByBookingId !==
                booking.id) {
            throw new Error("Driver is currently reserved for another passenger. Please choose another driver.");
        }
        if (availability?.reservedByBookingId ===
            booking.id &&
            availability.reservedUntil &&
            availability.reservedUntil <=
                now) {
            throw new Error("Your driver reservation has expired. Please choose another driver.");
        }
        const existingDriverBooking = await tx.booking.findFirst({
            where: {
                driverId: booking.driverId,
                id: {
                    not: booking.id,
                },
                status: {
                    in: [
                        "DRIVER_ACCEPTED",
                        "PLATFORM_PENDING",
                        "PLATFORM_TAKEN",
                        "DRIVER_MOVING",
                        "DRIVER_ARRIVED",
                        "RIDE_STARTED",
                    ],
                },
            },
            select: {
                id: true,
                passengerId: true,
                status: true,
            },
        });
        if (existingDriverBooking) {
            throw new Error("Driver is no longer available. Please choose another driver.");
        }
        const confirmedBooking = await tx.booking.update({
            where: {
                id: booking.id,
            },
            data: {
                status: "REQUEST_SENT",
                reservationUntil: null,
                reservationStartedAt: null,
                reservationExpiresAt: null,
                decisionUntil: null,
            },
        });
        if (availability &&
            availability.reservedByBookingId ===
                booking.id) {
            await tx.driverAvailability.update({
                where: {
                    id: availability.id,
                },
                data: {
                    reservedUntil: null,
                    reservedByBookingId: null,
                },
            });
        }
        return {
            ...confirmedBooking,
            confirmationStatus: "CONFIRMED",
            message: "Driver confirmed successfully.",
        };
    }, {
        isolationLevel: "Serializable",
        maxWait: 5000,
        timeout: 10000,
    });
};
