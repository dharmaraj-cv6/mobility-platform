import prisma from "../../config/prisma.js";
export const createRating = async (rideId, passengerId, driverId, rating, review) => {
    return prisma.rating.create({
        data: {
            rideId,
            passengerId,
            driverId,
            rating,
            review
        }
    });
};
export const getDriverRatings = async (driverId) => {
    return prisma.rating.findMany({
        where: {
            driverId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
