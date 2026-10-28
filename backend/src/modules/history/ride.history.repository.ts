import prisma from "../../config/prisma.js";

export const getDriverHistory = async (driverId: number) => {
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

export const getPassengerHistory = async (passengerId: number) => {
  return prisma.booking.findMany({
    where: {
      passengerId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};