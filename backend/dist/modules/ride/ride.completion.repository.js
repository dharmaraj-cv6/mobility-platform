import prisma from "../../config/prisma.js";
export const completeRide = async (rideId, paymentMethod) => {
    return prisma.ride.update({
        where: {
            id: rideId
        },
        data: {
            endTime: new Date(),
            status: "COMPLETED"
        }
    });
};
export const getRide = async (rideId) => {
    return prisma.ride.findUnique({
        where: {
            id: rideId
        }
    });
};
