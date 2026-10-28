import prisma from "../../../config/prisma.js";
// =====================================================
// GET MY ACTIVE RIDES
// =====================================================
export const getActiveRides = async (driverId) => {
    return prisma.booking.findMany({
        where: {
            driverId,
            status: {
                in: [
                    "DRIVER_MOVING",
                    "DRIVER_ARRIVED",
                    "RIDE_STARTED",
                    "DESTINATION_REACHED",
                ],
            },
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
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
};
// =====================================================
// GET SCHEDULED / ACCEPTED RIDES
// =====================================================
export const getScheduledRides = async (driverId) => {
    return prisma.booking.findMany({
        where: {
            driverId,
            status: "DRIVER_ACCEPTED",
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
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
// =====================================================
// GET MY RIDES
// =====================================================
export const getMyRides = async (driverId) => {
    const [active, scheduled,] = await Promise.all([
        getActiveRides(driverId),
        getScheduledRides(driverId),
    ]);
    return {
        active,
        scheduled,
    };
};
