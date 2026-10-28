import prisma from "../../config/prisma.js";

export const moveToPlatform = async (
  bookingId: number
) => {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      platformTaken: true,
      status: "PLATFORM_TAKEN"
    }
  });
};