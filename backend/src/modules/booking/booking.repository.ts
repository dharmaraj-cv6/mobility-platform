import prisma from "../../config/prisma.js";

import {
  Prisma,
} from "@prisma/client";

// =====================================================
// CREATE BOOKING
// =====================================================

export const createBooking = async (
  data: Prisma.BookingUncheckedCreateInput
) => {
  return prisma.booking.create({
    data,
  });
};

// =====================================================
// GET BOOKING BY ID
// =====================================================

export const getBooking = async (
  id: number
) => {
  return prisma.booking.findUnique({
    where: {
      id,
    },

    include: {
      passenger: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },

      driver: {
        select: {
          id: true,
          fullName: true,
          phone: true,

          driverProfile: {
            include: {
              availability: true,

              Vehicle: {
                where: {
                  isActive: true,
                },

                orderBy: {
                  isDefault: "desc",
                },
              },
            },
          },
        },
      },

      ride: true,

      cancellation: true,
    },
  });
};

// =====================================================
// GET PASSENGER BOOKINGS
// =====================================================

export const getPassengerBookings = async (
  passengerId: number
) => {
  return prisma.booking.findMany({
    where: {
      passengerId,
    },

    include: {
      driver: {
        select: {
          id: true,
          fullName: true,
          phone: true,

          driverProfile: {
            include: {
              Vehicle: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      },

      ride: true,

      cancellation: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// =====================================================
// GET DRIVER BOOKINGS
// =====================================================

export const getDriverBookings = async (
  driverId: number
) => {
  return prisma.booking.findMany({
    where: {
      driverId,
    },

    include: {
      passenger: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },

      ride: true,

      cancellation: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// =====================================================
// UPDATE BOOKING
// =====================================================

export const updateBooking = async (
  id: number,
  data: Prisma.BookingUncheckedUpdateInput
) => {
  return prisma.booking.update({
    where: {
      id,
    },

    data,
  });
};

// =====================================================
// DELETE BOOKING
// =====================================================

export const deleteBooking = async (
  id: number
) => {
  return prisma.booking.delete({
    where: {
      id,
    },
  });
};