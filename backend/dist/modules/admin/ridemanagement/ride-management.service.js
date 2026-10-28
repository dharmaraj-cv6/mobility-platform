import prisma from "../../../config/prisma.js";
// ============================================================
// GET ACTIVE RIDES
// ============================================================
export const getActiveRides = async () => {
    return await prisma.booking.findMany({
        where: {
            status: {
                notIn: [
                    "CANCELLED",
                ],
            },
        },
        orderBy: {
            id: "desc",
        },
        include: {
            driver: {
                include: {
                    driverProfile: true,
                    availability: true,
                },
            },
            passenger: true,
            company: true,
        },
    });
};
// ============================================================
// GET ALL RIDES
// ============================================================
export const getAllRides = async () => {
    return await prisma.booking.findMany({
        orderBy: {
            id: "desc",
        },
        include: {
            driver: {
                include: {
                    driverProfile: true,
                    availability: true,
                },
            },
            passenger: true,
            company: true,
        },
    });
};
// ============================================================
// GET SINGLE RIDE
// ============================================================
export const getRideById = async (bookingId) => {
    return await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            driver: {
                include: {
                    driverProfile: true,
                    availability: true,
                },
            },
            passenger: true,
            company: true,
            driverLeads: true,
        },
    });
};
// ============================================================
// ADMIN TAKE OVER
//
// IMPORTANT:
// This does NOT change the existing booking flow.
//
// It only returns takeover information.
// ============================================================
export const takeOverRide = async (bookingId, adminUserId) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        select: {
            id: true,
            status: true,
        },
    });
    if (!booking) {
        throw new Error("Ride not found.");
    }
    if (String(booking.status).toUpperCase() ===
        "CANCELLED") {
        throw new Error("This ride is no longer active.");
    }
    // ========================================================
    // DO NOT MODIFY BOOKING
    //
    // Existing booking / driver / watcher flow remains intact.
    // ========================================================
    return {
        bookingId,
        takenOver: true,
        adminUserId,
        currentStatus: booking.status,
    };
};
