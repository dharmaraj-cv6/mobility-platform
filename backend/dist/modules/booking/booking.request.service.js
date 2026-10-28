import prisma from "../../config/prisma.js";
// ============================================================
// ENTER DRIVER CONSIDERATION WINDOW
// ============================================================
export const reserveDriver = async (bookingId, driverProfileId) => {
    const now = new Date();
    return prisma.$transaction(async (tx) => {
        const driver = await tx.driverProfile.findUnique({
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
        if (driver.driverStatus !== "VERIFIED") {
            throw new Error("Driver is not verified.");
        }
        if (!driver.onboardingCompleted) {
            throw new Error("Driver onboarding is not completed.");
        }
        if (!driver.user?.isActive) {
            throw new Error("Driver account is not active.");
        }
        if (!driver.availability?.isOnline) {
            throw new Error("Driver is no longer online.");
        }
        if (driver.Vehicle.length === 0) {
            throw new Error("Driver has no approved active vehicle.");
        }
        const currentBooking = await tx.booking.findUnique({
            where: {
                id: bookingId,
            },
            select: {
                id: true,
                driverId: true,
                enteredAt: true,
                reservationUntil: true,
                decisionUntil: true,
                driverSelectionOrder: true,
                entryType: true,
            },
        });
        if (!currentBooking) {
            throw new Error("Booking not found.");
        }
        if (currentBooking.decisionUntil &&
            currentBooking.decisionUntil > now) {
            return currentBooking;
        }
        const activeBookings = await tx.booking.findMany({
            where: {
                driverId: driver.userId,
                decisionUntil: {
                    gt: now,
                },
                id: {
                    not: bookingId,
                },
                status: {
                    in: [
                        "REQUEST_SENT",
                        "DRIVER_SHARED",
                    ],
                },
            },
            orderBy: {
                enteredAt: "asc",
            },
            select: {
                id: true,
                enteredAt: true,
                reservationUntil: true,
                decisionUntil: true,
                driverSelectionOrder: true,
                entryType: true,
            },
        });
        if (activeBookings.length >= 3) {
            throw new Error("Driver is currently being considered by other passengers. Please choose another driver.");
        }
        // ========================================================
        // FIRST RIDER
        // ========================================================
        if (activeBookings.length === 0) {
            const reservationUntil = new Date(now.getTime() + 30 * 1000);
            const decisionUntil = new Date(now.getTime() + 60 * 1000);
            if (driver.availability) {
                await tx.driverAvailability.update({
                    where: {
                        driverProfileId: driverProfileId,
                    },
                    data: {
                        reservedUntil: reservationUntil,
                        reservedByBookingId: bookingId,
                    },
                });
            }
            const booking = await tx.booking.update({
                where: {
                    id: bookingId,
                },
                data: {
                    driverId: driver.userId,
                    enteredAt: now,
                    reservationStartedAt: now,
                    reservationExpiresAt: reservationUntil,
                    reservationUntil,
                    decisionUntil,
                    driverSelectionOrder: 1,
                    entryType: "SINGLE",
                    status: "REQUEST_SENT",
                },
            });
            return {
                ...booking,
                bookingId: booking.id,
                reservationExpiresAt: booking.reservationExpiresAt,
                decisionUntil: booking.decisionUntil,
                reservationStatus: "RESERVED",
            };
        }
        // ========================================================
        // EXISTING RIDERS
        // ========================================================
        const firstBooking = activeBookings[0];
        const firstEnteredAt = firstBooking.enteredAt;
        const elapsedFromFirst = firstEnteredAt
            ? now.getTime() -
                firstEnteredAt.getTime()
            : Number.MAX_SAFE_INTEGER;
        // ========================================================
        // ALL THREE
        // ========================================================
        if (activeBookings.length >= 2 &&
            elapsedFromFirst <= 3 * 1000) {
            if (driver.availability) {
                await tx.driverAvailability.update({
                    where: {
                        driverProfileId: driverProfileId,
                    },
                    data: {
                        reservedUntil: null,
                        reservedByBookingId: null,
                    },
                });
            }
            for (const booking of activeBookings) {
                const bookingEnteredAt = booking.enteredAt ?? now;
                const bookingDecisionUntil = new Date(bookingEnteredAt.getTime() +
                    60 * 1000);
                await tx.booking.update({
                    where: {
                        id: booking.id,
                    },
                    data: {
                        driverId: driver.userId,
                        enteredAt: bookingEnteredAt,
                        reservationStartedAt: null,
                        reservationExpiresAt: null,
                        reservationUntil: null,
                        decisionUntil: bookingDecisionUntil,
                        entryType: "ALL_THREE",
                        status: "REQUEST_SENT",
                    },
                });
            }
            const decisionUntil = new Date(now.getTime() + 60 * 1000);
            return tx.booking.update({
                where: {
                    id: bookingId,
                },
                data: {
                    driverId: driver.userId,
                    enteredAt: now,
                    reservationStartedAt: null,
                    reservationExpiresAt: null,
                    reservationUntil: null,
                    decisionUntil,
                    driverSelectionOrder: 3,
                    entryType: "ALL_THREE",
                    status: "REQUEST_SENT",
                },
            });
        }
        // ========================================================
        // ONE BY ONE
        // ========================================================
        const position = activeBookings.length + 1;
        const decisionSeconds = position === 2 ? 40 : 60;
        const decisionUntil = new Date(now.getTime() +
            decisionSeconds * 1000);
        const booking = await tx.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                driverId: driver.userId,
                enteredAt: now,
                reservationStartedAt: null,
                reservationExpiresAt: null,
                reservationUntil: null,
                decisionUntil,
                driverSelectionOrder: position,
                entryType: "ONE_BY_ONE",
                status: "REQUEST_SENT",
            },
        });
        return {
            ...booking,
            bookingId: booking.id,
            reservationExpiresAt: booking.reservationExpiresAt,
            decisionUntil: booking.decisionUntil,
            reservationStatus: "NOT_RESERVED",
        };
    }, {
        isolationLevel: "Serializable",
        maxWait: 5000,
        timeout: 10000,
    });
};
// ============================================================
// SEND REQUEST TO DRIVER
// ============================================================
export const sendRequestToDriver = async (bookingId, driverId) => {
    return reserveDriver(bookingId, driverId);
};
