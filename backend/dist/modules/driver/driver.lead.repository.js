import prisma from "../../config/prisma.js";
const LEAD_DECISION_WINDOW_MS = 15_000;
// ============================================================
// GET DRIVER BOOKING LEADS
//
// BookingDriverLead.driverId = User.id
// ============================================================
export const getMyBookingLeads = async (driverUserId) => {
    if (!Number.isInteger(driverUserId) || driverUserId <= 0) {
        throw new Error("Invalid driver user ID.");
    }
    return prisma.bookingDriverLead.findMany({
        where: {
            driverId: driverUserId,
            booking: {
                status: {
                    not: "CANCELLED",
                },
            },
        },
        orderBy: {
            sentAt: "desc",
        },
        include: {
            booking: {
                include: {
                    passenger: {
                        select: {
                            id: true,
                            fullName: true,
                            phone: true,
                        },
                    },
                    ride: true,
                    cancellation: true,
                },
            },
        },
    });
};
// ============================================================
// ACCEPT BOOKING LEAD
//
// Lead A (leadNumber = 1)
//   → Driver A is the selected driver.
//   → Booking becomes CONFIRMED.
//   → Watchers are stopped.
//   → Passenger can move to Ride Ready.
//   → START RIDE remains a separate driver action.
//
// Lead B (leadNumber = 2)
//   → Driver B is a suggested driver.
//   → Booking remains DRIVER_SHARED.
//   → Passenger confirmation is required.
//   → Watchers are stopped.
//   → No Driver C.
//
// IMPORTANT:
// BookingDriverLead.driverId is User.id.
// WatcherSession.driverProfileId is DriverProfile.id.
// ============================================================
export const acceptBookingLead = async (driverUserId, leadId) => {
    if (!Number.isInteger(driverUserId) || driverUserId <= 0) {
        throw new Error("Invalid driver user ID.");
    }
    if (!Number.isInteger(leadId) || leadId <= 0) {
        throw new Error("Invalid lead ID.");
    }
    return prisma.$transaction(async (tx) => {
        const lead = await tx.bookingDriverLead.findFirst({
            where: {
                id: leadId,
                driverId: driverUserId,
            },
            include: {
                booking: true,
            },
        });
        if (!lead) {
            throw new Error("Booking lead not found or no longer assigned to you.");
        }
        if (lead.leadNumber !== 1 && lead.leadNumber !== 2) {
            throw new Error("Invalid lead. Only Lead A and Lead B are allowed.");
        }
        if (lead.booking.status === "CANCELLED") {
            throw new Error("This booking has already been cancelled.");
        }
        // A lead must be acted on within its 15-second decision window.
        if (lead.booking.decisionUntil &&
            lead.booking.decisionUntil.getTime() <= Date.now()) {
            throw new Error("This booking lead has expired.");
        }
        // Another driver cannot take an already assigned booking.
        if (lead.booking.driverId !== null &&
            lead.booking.driverId !== driverUserId) {
            throw new Error("This booking has already been accepted by another driver.");
        }
        // ----------------------------------------------------------
        // Stop all watcher sessions for this booking.
        // This removes watcher counts from the passenger nearby list.
        // ----------------------------------------------------------
        await tx.watcherSession.deleteMany({
            where: {
                bookingId: lead.bookingId,
            },
        });
        const booking = await tx.booking.update({
            where: {
                id: lead.bookingId,
            },
            data: {
                driverId: driverUserId,
                driverSelectionOrder: lead.leadNumber,
                reservationExpiresAt: null,
                reservationStartedAt: null,
                reservationUntil: null,
                decisionUntil: null,
                status: lead.leadNumber === 1
                    ? "CONFIRMED"
                    : "DRIVER_SHARED",
            },
            include: {
                passenger: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                    },
                },
                ride: true,
                cancellation: true,
            },
        });
        // No further Lead C is permitted after an acceptance.
        await tx.bookingDriverLead.deleteMany({
            where: {
                bookingId: lead.bookingId,
            },
        });
        if (lead.leadNumber === 1) {
            return {
                mode: "SELECTED_DRIVER_CONFIRMED",
                requiresPassengerConfirmation: false,
                leadNumber: 1,
                booking,
            };
        }
        return {
            mode: "SUGGESTED_DRIVER_CONFIRMATION_REQUIRED",
            requiresPassengerConfirmation: true,
            leadNumber: 2,
            booking,
        };
    });
};
// ============================================================
// REJECT BOOKING LEAD
//
// Driver A rejects:
//   → A watcher is removed.
//   → Next active watcher becomes Lead B.
//   → Lead B gets a new 15-second decision window.
//
// Driver B rejects:
//   → B watcher is removed.
//   → NO Driver C.
//   → Booking goes directly to PLATFORM_PENDING for Admin.
//
// IMPORTANT:
// Only the rejected driver's watcher contribution is removed.
// Other nearby watchers remain until the booking is accepted,
// cancelled, or otherwise closed.
// ============================================================
export const rejectBookingLead = async (driverUserId, leadId) => {
    if (!Number.isInteger(driverUserId) || driverUserId <= 0) {
        throw new Error("Invalid driver user ID.");
    }
    if (!Number.isInteger(leadId) || leadId <= 0) {
        throw new Error("Invalid lead ID.");
    }
    return prisma.$transaction(async (tx) => {
        const lead = await tx.bookingDriverLead.findFirst({
            where: {
                id: leadId,
                driverId: driverUserId,
            },
            include: {
                booking: true,
            },
        });
        if (!lead) {
            throw new Error("Booking lead not found or no longer assigned to you.");
        }
        if (lead.leadNumber !== 1 && lead.leadNumber !== 2) {
            throw new Error("Invalid lead number.");
        }
        if (lead.booking.status === "CANCELLED") {
            throw new Error("This booking has already been cancelled.");
        }
        // ----------------------------------------------------------
        // Resolve User.id -> DriverProfile.id.
        // ----------------------------------------------------------
        const driverProfile = await tx.driverProfile.findUnique({
            where: {
                userId: driverUserId,
            },
            select: {
                id: true,
            },
        });
        // ----------------------------------------------------------
        // Remove ONLY this driver's watcher contribution.
        // ----------------------------------------------------------
        if (driverProfile) {
            await tx.watcherSession.deleteMany({
                where: {
                    bookingId: lead.bookingId,
                    driverProfileId: driverProfile.id,
                },
            });
        }
        // Remove the rejected lead.
        await tx.bookingDriverLead.delete({
            where: {
                id: lead.id,
            },
        });
        // ----------------------------------------------------------
        // Lead A rejected -> create Lead B.
        // ----------------------------------------------------------
        if (lead.leadNumber === 1) {
            const nextWatcher = await tx.watcherSession.findFirst({
                where: {
                    bookingId: lead.bookingId,
                    expiresAt: {
                        gt: new Date(),
                    },
                    ...(driverProfile
                        ? {
                            driverProfileId: {
                                not: driverProfile.id,
                            },
                        }
                        : {}),
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
            // No second driver is available.
            // Never create Driver C.
            if (!nextWatcher) {
                await tx.booking.update({
                    where: {
                        id: lead.bookingId,
                    },
                    data: {
                        status: "PLATFORM_PENDING",
                        platformTaken: false,
                        decisionUntil: null,
                    },
                });
                return {
                    mode: "ADMIN_LEAD",
                    adminLead: true,
                    leadNumber: null,
                    bookingId: lead.bookingId,
                };
            }
            const nextDriver = await tx.driverProfile.findUnique({
                where: {
                    id: nextWatcher.driverProfileId,
                },
                select: {
                    userId: true,
                },
            });
            if (!nextDriver) {
                await tx.booking.update({
                    where: {
                        id: lead.bookingId,
                    },
                    data: {
                        status: "PLATFORM_PENDING",
                        platformTaken: false,
                        decisionUntil: null,
                    },
                });
                return {
                    mode: "ADMIN_LEAD",
                    adminLead: true,
                    leadNumber: null,
                    bookingId: lead.bookingId,
                };
            }
            const existingLeadB = await tx.bookingDriverLead.findUnique({
                where: {
                    bookingId_leadNumber: {
                        bookingId: lead.bookingId,
                        leadNumber: 2,
                    },
                },
            });
            if (existingLeadB) {
                return {
                    mode: "LEAD_B_ALREADY_ASSIGNED",
                    adminLead: false,
                    leadNumber: 2,
                    bookingId: lead.bookingId,
                    driverId: nextDriver.userId,
                    lead: existingLeadB,
                };
            }
            const decisionUntil = new Date(Date.now() + LEAD_DECISION_WINDOW_MS);
            const leadB = await tx.bookingDriverLead.create({
                data: {
                    bookingId: lead.bookingId,
                    driverId: nextDriver.userId,
                    leadNumber: 2,
                    sentAt: new Date(),
                },
                include: {
                    booking: {
                        include: {
                            passenger: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    phone: true,
                                },
                            },
                            ride: true,
                            cancellation: true,
                        },
                    },
                },
            });
            const booking = await tx.booking.update({
                where: {
                    id: lead.bookingId,
                },
                data: {
                    status: "DRIVER_SHARED",
                    platformTaken: false,
                    decisionUntil,
                    driverSelectionOrder: 2,
                },
                include: {
                    passenger: {
                        select: {
                            id: true,
                            fullName: true,
                            phone: true,
                        },
                    },
                    ride: true,
                    cancellation: true,
                },
            });
            return {
                mode: "LEAD_B_CREATED",
                adminLead: false,
                leadNumber: 2,
                decisionUntil,
                booking,
                lead: leadB,
            };
        }
        // ----------------------------------------------------------
        // Lead B rejected -> Admin.
        //
        // NEVER create Lead C.
        // ----------------------------------------------------------
        await tx.booking.update({
            where: {
                id: lead.bookingId,
            },
            data: {
                status: "PLATFORM_PENDING",
                platformTaken: false,
                decisionUntil: null,
            },
        });
        // The booking is no longer in an active driver Lead cycle.
        // Remove any remaining watcher sessions for this booking.
        await tx.watcherSession.deleteMany({
            where: {
                bookingId: lead.bookingId,
            },
        });
        return {
            mode: "ADMIN_LEAD",
            adminLead: true,
            leadNumber: null,
            bookingId: lead.bookingId,
        };
    });
};
