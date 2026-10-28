import prisma from "../../config/prisma.js";
export const createEarning = async (driverId, rideId, fare, paymentMethod) => {
    return prisma.driverRideEarning.create({
        data: {
            driverId,
            rideId,
            fare,
            paymentMethod,
            paymentStatus: "SUCCESS"
        }
    });
};
export const getDriverEarnings = async (driverId) => {
    return prisma.driverRideEarning.findMany({
        where: {
            driverId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
