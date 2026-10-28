import prisma from "../../config/prisma.js";



export const createBooking = async (data: any) => {
  // ==========================================================
  // BASIC VALIDATION
  // ==========================================================

  const passengerId = Number(
    data.passengerId
  );

  const driverProfileId = Number(
    data.driverProfileId
  );

  if (!Number.isInteger(passengerId)) {
    throw new Error(
      "Invalid passenger ID."
    );
  }

  if (!Number.isInteger(driverProfileId)) {
    throw new Error(
      "Invalid driver profile ID."
    );
  }

  // ==========================================================
  // GET DRIVER
  //
  // driverProfileId comes from the reservation.
  //
  // Booking.driverId must be User.id.
  // ==========================================================

  const driver =
    await prisma.driverProfile.findUnique({
      where: {
        id: driverProfileId,
      },

      include: {
        user: true,

        availability: true,

        Vehicle: {
          where: {
            isActive: true,
            verificationStatus: "APPROVED",
          },

          take: 1,
        },
      },
    });

  if (!driver) {
    throw new Error(
      "Driver not found."
    );
  }

  // ==========================================================
  // DRIVER USER
  // ==========================================================

  if (!driver.user) {
    throw new Error(
      "Driver user account not found."
    );
  }

  const driverId =
    driver.user.id;

  // ==========================================================
  // DETERMINE BOOKING OWNER
  //
  // CompanyDriver.driverId uses DriverProfile.id.
  //
  // If selected driver belongs to a company:
  //
  // companyId = company.id
  //
  // Otherwise:
  //
  // companyId = null
  // ==========================================================

  const companyDriver =
    await prisma.companyDriver.findUnique({
      where: {
        driverId: driverProfileId,
      },
    });

  const companyId =
    companyDriver?.companyId ?? null;

  const companyOwned =
    companyId !== null;

  // ==========================================================
  // VERIFY DRIVER
  // ==========================================================

  if (
    driver.driverStatus !==
    "VERIFIED"
  ) {
    throw new Error(
      "Driver is not verified."
    );
  }

  if (
    driver.onboardingCompleted !==
    true
  ) {
    throw new Error(
      "Driver onboarding is not completed."
    );
  }

  if (
    driver.user.isActive !== true
  ) {
    throw new Error(
      "Driver account is not active."
    );
  }

  // ==========================================================
  // AVAILABILITY
  // ==========================================================

  const availability =
    driver.availability;

  if (!availability) {
    throw new Error(
      "Driver availability record not found."
    );
  }

  const now = new Date();

  // ==========================================================
  // RESERVATION MUST STILL BE ACTIVE
  // ==========================================================
const reservationOwner = availability.reservedByUserId;
const reservationUntil = availability.reservedUntil;

const hasActiveReservation =
  Boolean(reservationOwner) &&
  Boolean(reservationUntil) &&
  reservationUntil > now;

// Another passenger owns the active reservation.
if (
  hasActiveReservation &&
  reservationOwner !== passengerId
) {
  throw new Error(
    "Driver is reserved for another passenger. Please select another driver."
  );
}

// This passenger owns an active reservation.
if (
  hasActiveReservation &&
  reservationOwner === passengerId
) {
  // Continue confirmation.
} else {

}

  // ==========================================================
  // VEHICLE
  // ==========================================================

  const vehicle =
    driver.Vehicle?.[0];

  if (!vehicle) {
    throw new Error(
      "Driver has no approved active vehicle."
    );
  }

  // ==========================================================
  // MAP RIDE TYPE
  //
  // Frontend:
  //
  // RIDE_NOW
  //
  // Prisma:
  //
  // BOOK_NOW
  // ==========================================================

  let rideType:
    | "BOOK_NOW"
    | "BOOK_LATER"
    | "JOINED_RIDE";

  switch (data.rideType) {
    case "BOOK_LATER":
      rideType = "BOOK_LATER";
      break;

    case "JOINED_RIDE":
      rideType = "JOINED_RIDE";
      break;

    case "RIDE_NOW":
    case "BOOK_NOW":
    default:
      rideType = "BOOK_NOW";
      break;
  }

  // ==========================================================
  // MAP SERVICE TYPE → SERVICE ZONE
  //
  // Frontend:
  //
  // CITYRIDES
  //
  // Prisma:
  //
  // CITY
  // ==========================================================

  let serviceZone:
    | "CITY"
    | "CORPORATE"
    | "SCHOOL"
    | "CARGO"
    | "TOUR";

  switch (data.serviceType) {
    case "CORPORATE":
      serviceZone = "CORPORATE";
      break;

    case "SCHOOL":
      serviceZone = "SCHOOL";
      break;

    case "CARGO":
      serviceZone = "CARGO";
      break;

    case "TOURIST":
    case "TOUR":
      serviceZone = "TOUR";
      break;

    case "CITYRIDES":
    default:
      serviceZone = "CITY";
      break;
  }

  // ==========================================================
  // MAP VEHICLE
  //
  // Booking.vehicleType:
  //
  // AUTO
  // CAB
  // VAN
  // BUS
  //
  // Driver Vehicle:
  //
  // BIKE
  // AUTO
  // CAB_4
  // CAB_5
  // CAB_7
  // CAB_9
  // MINI_BUS
  // BUS
  // LCV
  // HCV
  // ==========================================================

  let vehicleType:
    | "AUTO"
    | "CAB"
    | "VAN"
    | "BUS";

  const actualVehicleType =
    vehicle.vehicleType;

  switch (actualVehicleType) {
    case "AUTO":
      vehicleType = "AUTO";
      break;

    case "CAB_4":
    case "CAB_5":
    case "CAB_7":
    case "CAB_9":
      vehicleType = "CAB";
      break;

    case "MINI_BUS":
      vehicleType = "VAN";
      break;

    case "BUS":
      vehicleType = "BUS";
      break;

    case "LCV":
    case "HCV":
      vehicleType = "BUS";
      break;

    case "BIKE":
      // Booking schema currently has no BIKE category.
      // Keep existing behavior.
      vehicleType = "CAB";
      break;

    default:
      throw new Error(
        "Unsupported vehicle type."
      );
  }

  // ==========================================================
  // ADDRESSES
  // ==========================================================

  const pickupAddress =
    data.pickupAddress ||
    data.pickupLocation?.name ||
    data.pickupLocation?.address;

  const dropAddress =
    data.dropAddress ||
    data.destination ||
    data.destinationLocation?.name ||
    data.destinationLocation?.address;

  if (!pickupAddress) {
    throw new Error(
      "Pickup address is required."
    );
  }

  if (!dropAddress) {
    throw new Error(
      "Destination address is required."
    );
  }

  // ==========================================================
  // COORDINATES
  // ==========================================================

  const pickupLatitude =
    data.pickupLatitude ??
    data.pickupLocation?.latitude ??
    null;

  const pickupLongitude =
    data.pickupLongitude ??
    data.pickupLocation?.longitude ??
    null;

  const dropLatitude =
    data.dropLatitude ??
    data.destinationLocation?.latitude ??
    null;

  const dropLongitude =
    data.dropLongitude ??
    data.destinationLocation?.longitude ??
    null;

  // ==========================================================
  // FARE
  // ==========================================================

  const estimatedFare =
    Number(
      data.estimatedFare ??
      data.fare ??
      0
    );

  if (
    !Number.isFinite(
      estimatedFare
    )
  ) {
    throw new Error(
      "Invalid estimated fare."
    );
  }

  // ==========================================================
  // DISTANCE
  // ==========================================================

  const estimatedDistance =
    data.estimatedDistance ??
    data.tripDistance ??
    data.distance ??
    null;

  // ==========================================================
  // ARRIVAL FILTER
  // ==========================================================

  const arrivalFilter =
    Number(
      data.arrivalFilter ??
      5
    );

  // ==========================================================
  // CREATE BOOKING
  // ==========================================================

  const booking =
    await prisma.booking.create({
      data: {
        passengerId,

        driverId,

        companyId,

        rideType,

        serviceZone,

        vehicleType,

        pickupAddress,

        pickupLatitude,

        pickupLongitude,

        dropAddress,

        dropLatitude,

        dropLongitude,

        estimatedDistance,

        estimatedFare,

        arrivalFilter,
      },
    });

  // ==========================================================
// CREATE INITIAL DRIVER LEAD
//
// FINAL FLOW:
//
// The passenger selected this driver.
//
// Account type does NOT matter:
//
// ACTIVE_DRIVER       → Lead A
// DRIVER_OWNER        → Lead A
// VEHICLE_OWNER       → Lead A
// COMPANY DRIVER      → Lead A
//
// The selected driver always receives Lead A.
//
// BookingDriverLead.driverId MUST be User.id.
// ==========================================================

await prisma.bookingDriverLead.create({
  data: {
    bookingId: booking.id,
    driverId,
    leadNumber: 1,
  },
});

  // ==========================================================
  // CLEAR DRIVER RESERVATION
  //
  // Booking has now been successfully created.
  // ==========================================================

  await prisma.driverAvailability.update({
    where: {
      id: availability.id,
    },

    data: {
      reservedByUserId: null,

      reservedUntil: null,
    },
  });

  // ==========================================================
  // RETURN BOOKING
  // ==========================================================

  return booking;
};

// ============================================================
// GET BOOKING
// ============================================================

export const getBooking = async (
  id: number
) => {
  return await prisma.booking.findUnique({
    where: {
      id,
    },
  });
};

// ============================================================
// RESERVE DRIVER FOR 30 SECONDS
// ============================================================

export const reserveDriver = async (
  driverProfileId: number,
  passengerId: number
) => {
  const now = new Date();

  const reservedUntil =
    new Date(
      now.getTime() +
        30 * 1000
    );

  // ==========================================================
  // GET DRIVER
  // ==========================================================

  const driver =
    await prisma.driverProfile.findUnique({
      where: {
        id: driverProfileId,
      },

      include: {
        user: true,

        availability: true,

        Vehicle: {
          where: {
            isActive: true,
            verificationStatus: "APPROVED",
          },

          take: 1,
        },

        services: true,
      },
    });

  if (!driver) {
    throw new Error(
      "Driver not found."
    );
  }

  // ==========================================================
  // DRIVER VALIDATION
  // ==========================================================

  if (
    driver.driverStatus !==
    "VERIFIED"
  ) {
    throw new Error(
      "Driver is not verified."
    );
  }

  if (
    driver.onboardingCompleted !==
    true
  ) {
    throw new Error(
      "Driver onboarding is not completed."
    );
  }

  if (
    driver.user?.isActive !== true
  ) {
    throw new Error(
      "Driver account is not active."
    );
  }

  const availability =
    driver.availability;

  if (!availability) {
    throw new Error(
      "Driver availability record not found."
    );
  }

  if (
    availability.isOnline !== true
  ) {
    throw new Error(
      "Driver is no longer online."
    );
  }

  if (
    !driver.Vehicle ||
    driver.Vehicle.length === 0
  ) {
    throw new Error(
      "Driver has no approved active vehicle."
    );
  }

  // ==========================================================
  // EXISTING RESERVATION
  // ==========================================================

  if (
    availability.reservedUntil &&
    availability.reservedUntil > now
  ) {
    if (
      availability.reservedByUserId !==
      passengerId
    ) {
      throw new Error(
        "Driver is currently reserved for another passenger."
      );
    }
  }

  // ==========================================================
  // ATOMIC RESERVATION
  // ==========================================================

  const updated =
    await prisma.driverAvailability.updateMany({
      where: {
        id: availability.id,

        isOnline: true,

        OR: [
          {
            reservedUntil: null,
          },

          {
            reservedUntil: {
              lte: now,
            },
          },

          {
            reservedByUserId:
              passengerId,
          },
        ],
      },

      data: {
        reservedByUserId:
          passengerId,

        reservedUntil,
      },
    });

  if (
    updated.count !== 1
  ) {
    throw new Error(
      "Driver is no longer available. Please select another driver."
    );
  }

  return {
    driverProfileId,

    reservationStartedAt:
      now,

    reservationExpiresAt:
      reservedUntil,

    reservationStatus:
      "RESERVED",
  };
};

// ============================================================
// COMPANY CONFIRM LEAD
//
// Company confirms passenger's selected company driver.
//
// Flow:
//
// Passenger selects company driver
//        ↓
// Booking created
//        ↓
// Company receives booking
//        ↓
// Company confirms
//        ↓
// Selected driver gets lead
//
// NO driver discovery.
// NO radius search.
// NO waiting.
// ============================================================

export const confirmCompanyLead = async (
  bookingId: number,
  companyUserId: number
) => {
  // Keep parameter ready for the company-controller
  // authorization layer when the company user relationship
  // is added to the schema.
  void companyUserId;

  // ----------------------------------------------------------
  // GET BOOKING
  // ----------------------------------------------------------

  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  // ----------------------------------------------------------
  // MUST BE COMPANY-OWNED
  // ----------------------------------------------------------

  if (!booking.companyId) {
    throw new Error(
      "This booking is not company-owned."
    );
  }

  // ----------------------------------------------------------
  // PASSENGER SELECTED DRIVER
  // ----------------------------------------------------------

  if (!booking.driverId) {
    throw new Error(
      "No driver is assigned to this booking."
    );
  }

  // ----------------------------------------------------------
  // GET DRIVER PROFILE
  //
  // Booking.driverId = User.id
  //
  // DriverProfile.userId = User.id
  // ----------------------------------------------------------

  const selectedDriver =
    await prisma.driverProfile.findUnique({
      where: {
        userId:
          booking.driverId,
      },
    });

  if (!selectedDriver) {
    throw new Error(
      "Selected driver profile not found."
    );
  }

  // ----------------------------------------------------------
  // VERIFY DRIVER BELONGS TO COMPANY
  // ----------------------------------------------------------

  const companyDriver =
    await prisma.companyDriver.findFirst({
      where: {
        companyId:
          booking.companyId,

        driverId:
          selectedDriver.id,
      },
    });

  if (!companyDriver) {
    throw new Error(
      "Selected driver does not belong to this company."
    );
  }

  // ----------------------------------------------------------
  // PREVENT DUPLICATE LEAD
  // ----------------------------------------------------------

  const existingLead =
    await prisma.bookingDriverLead.findFirst({
      where: {
        bookingId,
      },
    });

  if (existingLead) {
    throw new Error(
      "Driver lead already exists."
    );
  }

  // ----------------------------------------------------------
  // CREATE DRIVER LEAD
  // ----------------------------------------------------------

  const lead =
    await prisma.bookingDriverLead.create({
      data: {
        bookingId,

        driverId:
          booking.driverId,

        leadNumber: 1,
      },
    });

  // ----------------------------------------------------------
  // RETURN UPDATED BOOKING
  // ----------------------------------------------------------

  const updatedBooking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

  return {
    booking:
      updatedBooking,

    lead,
  };
};

// ============================================================
// COMPANY REJECT LEAD
//
// Company rejects passenger's selected company driver.
//
// No driver lead is created.
//
// Booking remains company-controlled.
//
// Next step:
// Company assigns another available company driver.
// ============================================================

export const rejectCompanyLead = async (
  bookingId: number,
  companyUserId: number
) => {
  // Keep parameter ready for company-controller
  // authorization layer.
  void companyUserId;

  // ----------------------------------------------------------
  // GET BOOKING
  // ----------------------------------------------------------

  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

  if (!booking) {
    throw new Error(
      "Booking not found."
    );
  }

  // ----------------------------------------------------------
  // MUST BE COMPANY-OWNED
  // ----------------------------------------------------------

  if (!booking.companyId) {
    throw new Error(
      "This booking is not company-owned."
    );
  }

  // ----------------------------------------------------------
  // REMOVE ANY DRIVER LEAD
  //
  // Normally no lead exists before company confirmation.
  // This keeps the booking clean if a previous lead exists.
  // ----------------------------------------------------------

  await prisma.bookingDriverLead.deleteMany({
    where: {
      bookingId,
    },
  });

  // ----------------------------------------------------------
  // RETURN BOOKING
  // ----------------------------------------------------------

  return await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
};
