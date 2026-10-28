import prisma from "../../config/prisma.js";

export const createEarning = async (
  driverId: number,
  rideId: number,
  fare: number,
  paymentMethod: any
) => {
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

export const getDriverEarnings = async (
  driverId: number
) => {
  return prisma.driverRideEarning.findMany({
    where: {
      driverId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};