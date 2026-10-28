import prisma from "../../config/prisma.js";

// =====================================================
// GET RIDE
// =====================================================

export const getRide = async (
  rideId: number
) => {
  return prisma.ride.findUnique({
    where: {
      id: rideId,
    },
  });
};

// =====================================================
// REACH DESTINATION
// =====================================================

export const reachDestination = async (
  rideId: number
) => {
  return prisma.$transaction(
    async (tx) => {
      const ride =
        await tx.ride.findUnique({
          where: {
            id: rideId,
          },
        });

      if (!ride) {
        throw new Error(
          "Ride not found."
        );
      }

      const updatedRide =
        await tx.ride.update({
          where: {
            id: rideId,
          },

          data: {
            status: "IN_PROGRESS",
          },
        });

      const booking =
        await tx.booking.update({
          where: {
            id: ride.bookingId,
          },

          data: {
            status:
              "DESTINATION_REACHED",
          },
        });

      return {
        ride: {
          id: updatedRide.id,
          bookingId:
            updatedRide.bookingId,
          status: updatedRide.status,
        },

        booking,
      };
    }
  );
};

// =====================================================
// COMPLETE RIDE
// =====================================================

export const completeRide = async (
  rideId: number,
  paymentMethod: string
) => {
  return prisma.$transaction(
    async (tx) => {
      const ride =
        await tx.ride.findUnique({
          where: {
            id: rideId,
          },
        });

      if (!ride) {
        throw new Error(
          "Ride not found."
        );
      }

      const updatedRide =
        await tx.ride.update({
          where: {
            id: rideId,
          },

          data: {
            endTime: new Date(),
            status: "COMPLETED",
          },
        });

      const booking =
        await tx.booking.update({
          where: {
            id: ride.bookingId,
          },

          data: {
            status:
              "PAYMENT_COMPLETED",
          },
        });

      return {
        ride: updatedRide,
        booking,
        paymentMethod,
      };
    }
  );
};