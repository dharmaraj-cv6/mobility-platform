import prisma from "../../config/prisma.js";
export const shareBooking = async (bookingId, nextDriverId) => {
    return prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            driverId: nextDriverId,
            driverShareCount: {
                increment: 1,
            },
            platformTaken: false,
            status: "DRIVER_SHARED",
        },
    });
};
export const findBooking = async (bookingId) => {
    return prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
};
