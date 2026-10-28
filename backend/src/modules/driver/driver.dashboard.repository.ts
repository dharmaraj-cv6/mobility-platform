import prisma from "../../config/prisma.js";

// ========================================
// GET DRIVER DASHBOARD
// ========================================

export const getDashboard = async (
  userId: number
) => {
  // --------------------------------------
  // Find Driver
  // --------------------------------------

  const driver =
    await prisma.driverProfile.findUnique({
      where: {
        userId,
      },

      include: {
        availability: true,
      },
    });

  if (!driver) {
    throw new Error(
      "Driver profile not found."
    );
  }

  // --------------------------------------
  // Today Start / End
  // --------------------------------------

  const now = new Date();

  const startOfDay = new Date(now);

  startOfDay.setHours(
    0,
    0,
    0,
    0
  );

  const endOfDay = new Date(now);

  endOfDay.setHours(
    23,
    59,
    59,
    999
  );

  // --------------------------------------
  // TODAY'S EARNINGS
  // --------------------------------------

  const earnings =
    await prisma.driverRideEarning.findMany({
      where: {
        driverId: driver.id,

        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

  // --------------------------------------
  // CALCULATE EARNINGS
  // --------------------------------------

  const totalEarnings =
    earnings.reduce(
      (total, item) =>
        total + Number(item.fare),
      0
    );

  // --------------------------------------
  // PENDING DRIVER LEADS
  //
  // IMPORTANT:
  //
  // BookingDriverLead.driverId = User.id
  //
  // Therefore use userId here,
  // NOT driver.id.
  // --------------------------------------

  const pendingRequests =
    await prisma.bookingDriverLead.count({
      where: {
        driverId: userId,

        booking: {
          status: {
            in: [
              "REQUEST_SENT",
              "DRIVER_SHARED",
              "PENDING",
            ],
          },
        },
      },
    });

  // --------------------------------------
  // COMPLETED RIDES
  // --------------------------------------

 const completedRides =
  await prisma.ride.count({
    where: {
      booking: {
        driverId: userId,
      },

      status: "COMPLETED",
    },
  });

  // --------------------------------------
  // DASHBOARD RESPONSE
  // --------------------------------------

  return {
    onlineStatus:
      driver.availability?.isOnline ??
      false,

    todayRides:
      earnings.length,

    todayEarnings:
      totalEarnings,

    pendingRequests,

    completedRides,
  };
};