import prisma from "../../config/prisma.js";

export const getDailyReport = async () => {
  const totalBookings =
    await prisma.booking.count();

  const totalRides =
    await prisma.ride.count();

  const totalDrivers =
    await prisma.driverProfile.count();

  const earnings =
    await prisma.driverRideEarning.findMany();

  const totalRevenue =
    earnings.reduce(
      (sum, item) =>
        sum + Number(item.fare),
      0
    );

  return {
    totalBookings,
    totalRides,
    totalDrivers,
    totalRevenue
  };
};