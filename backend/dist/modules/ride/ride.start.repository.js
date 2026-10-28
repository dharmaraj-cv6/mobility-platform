import prisma from "../../config/prisma.js";
export const createRide = async (bookingId) => {
    return prisma.ride.create({
        data: {
            bookingId,
            startTime: new Date()
        }
    });
};
export const findRideByBookingId = async (bookingId) => {
    return prisma.ride.findUnique({
        where: {
            bookingId
        }
    });
};
