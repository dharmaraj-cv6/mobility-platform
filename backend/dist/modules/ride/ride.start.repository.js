import prisma from "../../config/prisma.js";
export const startPickup = async (bookingId) => {
    return prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: "DRIVER_MOVING",
        },
    });
};
export const arriveAtPickup = async (bookingId) => {
    return prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: "DRIVER_ARRIVED",
        },
    });
};
export const createRide = async (bookingId) => {
    return prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
            where: {
                id: bookingId,
            },
        });
        if (!booking) {
            throw new Error("Booking not found.");
        }
        if (booking.status !== "DRIVER_ARRIVED") {
            throw new Error("Driver must arrive at pickup before starting the trip.");
        }
        const ride = await tx.ride.create({
            data: {
                bookingId,
                startTime: new Date(),
                status: "IN_PROGRESS",
            },
        });
        const updatedBooking = await tx.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status: "RIDE_STARTED",
            },
        });
        return {
            ride,
            booking: updatedBooking,
        };
    });
};
export const findRideByBookingId = async (bookingId) => {
    return prisma.ride.findUnique({
        where: {
            bookingId,
        },
    });
};
export const getBooking = async (bookingId) => {
    return prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
};
