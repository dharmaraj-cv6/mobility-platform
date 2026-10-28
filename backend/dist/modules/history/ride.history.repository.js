import prisma from "../../config/prisma.js";
export const getDriverHistory = async (driverId) => {
    return prisma.driverRideEarning.findMany({
        where: {
            driverId
        },
        include: {
            ride: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
export const getPassengerHistory = async (passengerId) => {
    return prisma.booking.findMany({
        where: {
            passengerId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
