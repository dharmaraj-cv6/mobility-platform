import prisma from "../../config/prisma.js";

// ============================================================
// PASSENGER CONFIRM BOOKING
// ============================================================
//
// Passenger selects driver
//        ↓
// Driver reserved for passenger
//        ↓
// Passenger confirms
//        ↓
// Booking remains REQUEST_SENT
//        ↓
// Driver can accept/reject
//
// BookingStatus does NOT use CONFIRMED.
// ============================================================

export const confirmBooking = async (
  bookingId: number,
  passengerId: number
) => {
  return prisma.$transaction(
    async (tx) => {
      const now = new Date();

      // --------------------------------------------------------
      // GET BOOKING
      // --------------------------------------------------------

      const booking =
        await tx.booking.findUnique({
          where: {
            id: bookingId,
          },

          select: {
            id: true,
            passengerId: true,
            driverId: true,
            status: true,

            reservationUntil: true,
            reservationStartedAt: true,
            reservationExpiresAt: true,

            decisionUntil: true,
            entryType: true,
          },
        });

      if (!booking) {
        throw new Error(
          "Booking not found."
        );
      }

      // --------------------------------------------------------
      // PASSENGER OWNERSHIP
      // --------------------------------------------------------

      if (
        booking.passengerId !==
        passengerId
      ) {
        throw new Error(
          "You are not allowed to confirm this booking."
        );
      }

      // --------------------------------------------------------
      // DRIVER REQUIRED
      // --------------------------------------------------------

      if (!booking.driverId) {
        throw new Error(
          "No driver is assigned to this booking."
        );
      }

      // --------------------------------------------------------
      // BOOKING STATUS
      // --------------------------------------------------------

      if (
        booking.status !==
        "REQUEST_SENT"
      ) {
        throw new Error(
          "This booking is no longer available for confirmation."
        );
      }

      // --------------------------------------------------------
      // DECISION WINDOW
      // --------------------------------------------------------

      if (
        !booking.decisionUntil
      ) {
        throw new Error(
          "Your booking confirmation window is not available."
        );
      }

      if (
        booking.decisionUntil <=
        now
      ) {
        throw new Error(
          "Your booking confirmation window has expired. Please choose another driver."
        );
      }

      // --------------------------------------------------------
      // DRIVER PROFILE
      // --------------------------------------------------------

      const driver =
        await tx.driverProfile.findUnique({
          where: {
            userId:
              booking.driverId,
          },

          select: {
            id: true,

            availability: {
              select: {
                id: true,
                reservedUntil: true,
                reservedByBookingId:
                  true,
              },
            },
          },
        });

      if (!driver) {
        throw new Error(
          "Driver profile not found."
        );
      }

      // --------------------------------------------------------
      // DRIVER RESERVATION
      // --------------------------------------------------------

      const availability =
        driver.availability;

      // Driver reserved by another booking
      if (
        availability
          ?.reservedByBookingId &&
        availability.reservedByBookingId !==
          booking.id
      ) {
        throw new Error(
          "Driver is currently reserved for another passenger. Please choose another driver."
        );
      }

      // This booking's reservation expired
      if (
        availability
          ?.reservedByBookingId ===
          booking.id &&
        availability.reservedUntil &&
        availability.reservedUntil <=
          now
      ) {
        throw new Error(
          "Your driver reservation has expired. Please choose another driver."
        );
      }

      // --------------------------------------------------------
      // CHECK DRIVER ALREADY TAKEN
      // --------------------------------------------------------

      const existingBooking =
        await tx.booking.findFirst({
          where: {
            driverId:
              booking.driverId,

            id: {
              not: booking.id,
            },

            status: {
              in: [
                "DRIVER_ACCEPTED",
                "PLATFORM_PENDING",
                "PLATFORM_TAKEN",
                "DRIVER_MOVING",
                "DRIVER_ARRIVED",
                "RIDE_STARTED",
                "DESTINATION_REACHED",
              ],
            },
          },

          select: {
            id: true,
            status: true,
          },
        });

      if (existingBooking) {
        throw new Error(
          "Driver is no longer available. Please choose another driver."
        );
      }

      // --------------------------------------------------------
      // PASSENGER CONFIRMATION
      // --------------------------------------------------------
      //
      // IMPORTANT:
      // Do NOT use CONFIRMED.
      //
      // REQUEST_SENT is retained until driver accepts.
      // --------------------------------------------------------

      const confirmedBooking =
        await tx.booking.update({
          where: {
            id: booking.id,
          },

          data: {
            status:
              "REQUEST_SENT",

            reservationUntil:
              null,

            reservationStartedAt:
              null,

            reservationExpiresAt:
              null,

            decisionUntil:
              null,
          },
        });

      // --------------------------------------------------------
      // RELEASE DRIVER RESERVATION
      // --------------------------------------------------------

      if (
        availability &&
        availability.reservedByBookingId ===
          booking.id
      ) {
        await tx.driverAvailability.update({
          where: {
            id:
              availability.id,
          },

          data: {
            reservedUntil:
              null,

            reservedByBookingId:
              null,
          },
        });
      }

      // --------------------------------------------------------
      // CLOSE OTHER REQUESTS FOR SAME DRIVER
      // --------------------------------------------------------

      await tx.booking.updateMany({
        where: {
          driverId:
            booking.driverId,

          id: {
            not: booking.id,
          },

          status:
            "REQUEST_SENT",

          decisionUntil: {
            gt: now,
          },
        },

        data: {
          decisionUntil:
            now,
        },
      });

      // --------------------------------------------------------
      // RESPONSE
      // --------------------------------------------------------

      return {
        ...confirmedBooking,

        confirmationStatus:
          "CONFIRMED",

        message:
          "Driver confirmed successfully.",
      };
    },

    {
      isolationLevel:
        "Serializable",

      maxWait: 5000,

      timeout: 10000,
    }
  );
};

// ============================================================
// DRIVER ACCEPT BOOKING
// ============================================================

export const acceptBooking = async (
  bookingId: number
) => {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      select: {
        id: true,
        status: true,
      },
    });

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  if (
    booking.status !==
    "REQUEST_SENT"
  ) {
    throw new Error(
      "This booking request is no longer available."
    );
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status:
        "DRIVER_ACCEPTED",
    },
  });
};

// ============================================================
// DRIVER REJECT BOOKING
// ============================================================

export const rejectBooking = async (
  bookingId: number
) => {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      select: {
        id: true,
        status: true,
      },
    });

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  if (
    booking.status !==
    "REQUEST_SENT"
  ) {
    throw new Error(
      "This booking request is no longer available."
    );
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status:
        "REQUEST_SENT",

      decisionUntil:
        new Date(),
    },
  });
};