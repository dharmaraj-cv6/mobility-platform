import prisma from "../../config/prisma.js";

const ONLINE_SESSION_MINUTES = 45;

// ============================================================
// GET DRIVER PROFILE FROM USER ID
// ============================================================

const getDriverProfileId = async (
  userId: number
): Promise<number> => {
  const driverProfile =
    await prisma.driverProfile.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,
      },
    });

  if (!driverProfile) {
    throw new Error(
      "Driver profile not found."
    );
  }

  return driverProfile.id;
};

// ============================================================
// GET DRIVER AVAILABILITY
// ============================================================

export const getAvailability = async (
  userId: number
) => {
  const driverProfileId =
    await getDriverProfileId(userId);

  return prisma.driverAvailability.findUnique({
    where: {
      driverProfileId,
    },
  });
};

// ============================================================
// UPDATE ONLINE / OFFLINE
// ============================================================
//
// ONLY this function changes isOnline.
//
// Online:
//   isOnline = true
//
// Offline:
//   isOnline = false
//
// GPS updates NEVER change online status.
// ============================================================

export const updateAvailability = async (
  userId: number,
  isOnline: boolean
) => {
  const driverProfileId =
    await getDriverProfileId(userId);

  return prisma.driverAvailability.upsert({
    where: {
      driverProfileId,
    },

    create: {
      driverProfileId,
      isOnline,
      lastSeen: new Date(),
    },

    update: {
      isOnline,
      lastSeen: new Date(),
    },
  });
};

// ============================================================
// UPDATE DRIVER LOCATION
// ============================================================
//
// IMPORTANT:
//
// GPS update does NOT make driver online.
//
// Existing record:
//   preserve isOnline
//
// No record:
//   create OFFLINE
// ============================================================

export const updateLocation = async (
  userId: number,
  latitude: number,
  longitude: number
) => {
  const driverProfileId =
    await getDriverProfileId(userId);

  return prisma.driverAvailability.upsert({
    where: {
      driverProfileId,
    },

    create: {
      driverProfileId,

      // GPS must NEVER activate driver.
      isOnline: false,

      currentLatitude:
        latitude,

      currentLongitude:
        longitude,

      lastSeen:
        new Date(),
    },

    update: {
      // IMPORTANT:
      // Do not touch isOnline here.

      currentLatitude:
        latitude,

      currentLongitude:
        longitude,

      lastSeen:
        new Date(),
    },
  });
};

// ============================================================
// GET ONLINE DRIVERS
// ============================================================
//
// This is the GENERAL online-driver list.
//
// Conditions:
//
// 1. Driver is online
// 2. Driver's online session is still valid
// 3. Driver has GPS location
// 4. User account is active
// 5. Driver is VERIFIED
// 6. Onboarding is completed
// 7. Driver has at least one active vehicle
//
// IMPORTANT:
//
// Do NOT put unknown service fields such as:
//   services.isActive
//
// here.
//
// Service/fare eligibility should be handled by the
// booking-selection layer where the exact service schema
// is known.
// ============================================================

export const getOnlineDrivers = async () => {
  const now =
    new Date();

  const sessionCutoff =
    new Date(
      now.getTime() -
        ONLINE_SESSION_MINUTES *
          60 *
          1000
    );

  return prisma.driverProfile.findMany({
    where: {
      // --------------------------------------------------------
      // DRIVER APPROVAL
      // --------------------------------------------------------

      driverStatus:
        "VERIFIED",

      onboardingCompleted:
        true,

      // --------------------------------------------------------
      // USER ACCOUNT
      // --------------------------------------------------------

      user: {
        isActive: true,
      },

      // --------------------------------------------------------
      // AVAILABILITY
      // --------------------------------------------------------

      availability: {
        isOnline: true,

        lastSeen: {
          gte: sessionCutoff,
        },

        currentLatitude: {
          not: null,
        },

        currentLongitude: {
          not: null,
        },
      },

      // --------------------------------------------------------
      // VEHICLE
      // --------------------------------------------------------
      //
      // At least one active vehicle is required.
      //
      // Do NOT require APPROVED here if this endpoint is
      // intended only as the general online-driver endpoint.
      //
      // Booking eligibility can apply vehicle verification.
      // --------------------------------------------------------

      Vehicle: {
        some: {
          isActive: true,
        },
      },
    },

    include: {
      // --------------------------------------------------------
      // AVAILABILITY
      // --------------------------------------------------------

      availability: true,

      // --------------------------------------------------------
      // USER
      // --------------------------------------------------------
      //
      // businessName removed because it does not exist in
      // your current Prisma User model.
      // --------------------------------------------------------

      user: {
        select: {
          id: true,

          fullName: true,

          isActive: true,
        },
      },

      // --------------------------------------------------------
      // VEHICLES
      // --------------------------------------------------------

      Vehicle: {
        where: {
          isActive: true,
        },

        orderBy: [
          {
            isDefault: "desc",
          },

          {
            createdAt: "asc",
          },
        ],
      },

      // --------------------------------------------------------
      // DRIVER SERVICES
      // --------------------------------------------------------
      //
      // IMPORTANT:
      // No `where: { isActive: true }` here because your
      // service model does not expose an isActive field.
      //
      // Return the services exactly as defined in Prisma.
      // --------------------------------------------------------

      services: true,
    },

    orderBy: {
      id: "asc",
    },
  });
};