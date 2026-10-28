import prisma from "../../config/prisma.js";

export const createRating = async (
  rideId: number,
  passengerId: number,
  driverId: number,
  rating: number,
  review?: string
) => {
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

export const getDriverRatings = async (
  driverId: number
) => {
  return prisma.rating.findMany({
    where: {
      driverId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};