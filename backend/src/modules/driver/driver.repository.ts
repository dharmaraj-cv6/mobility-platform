import prisma from "../../config/prisma.js";
import {
  Prisma,
  UserRole,
  DriverStatus,
} from "@prisma/client";

// ========================================
// FIND DRIVER BY AADHAAR
// ========================================

export const findByAadhaar = async (
  aadhaar: string
) => {
  return prisma.driverProfile.findUnique({
    where: {
      aadhaar,
    },
  });
};

// ========================================
// FIND DRIVER BY LICENCE
// ========================================

export const findByLicence = async (
  licenceNumber: string
) => {
  return prisma.driverProfile.findUnique({
    where: {
      licenceNumber,
    },
  });
};

// ========================================
// FIND VEHICLE BY REGISTRATION
// ========================================

export const findVehicleByRegistration = async (
  registrationNumber: string
) => {
  return prisma.vehicle.findUnique({
    where: {
      registrationNumber,
    },
  });
};

// ========================================
// FIND DRIVER BY USER ID
// ========================================

export const findDriverByUserId = async (
  userId: number
) => {
  return prisma.driverProfile.findUnique({
    where: {
      userId,
    },
  });
};

// ========================================
// GET DRIVER ONBOARDING STEP
// ========================================

export const getDriverOnboardingStep = async (
  userId: number
) => {
  return prisma.driverProfile.findUnique({
    where: {
      userId,
    },

    select: {
      id: true,
      onboardingStep: true,
    },
  });
};

// ========================================
// CREATE DRIVER REGISTRATION
// ========================================

export const createDriverRegistration = async (
  userId: number,
  data: any
) => {
  return prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // ------------------------------------
      // Driver Profile
      // ------------------------------------

      const driverProfile =
        await tx.driverProfile.create({
          data: {
            userId,

            dob: new Date(data.dob),

            gender: data.gender,

            aadhaar: data.aadhaar,

            licenceNumber:
              data.licenceNumber,

            address: data.address,

            district: data.district,

            state: data.state,

            pincode: data.pincode,

            businessType:
              data.businessType,

            driverStatus:
              DriverStatus.PENDING,

            onboardingStep: 1,

            onboardingCompleted: false,
          },
        });

      // ------------------------------------
      // Driver Experience
      // ------------------------------------

      await tx.driverExperience.create({
        data: {
          driverProfileId:
            driverProfile.id,

          experience:
            data.experience,

          workedPlatforms:
            data.workedPlatforms ?? [],

          languages:
            data.languages ?? [],
        },
      });

      // ------------------------------------
      // Change User Role
      // ------------------------------------

      await tx.user.update({
        where: {
          id: userId,
        },

        data: {
          role: UserRole.DRIVER,
        },
      });

      return driverProfile;
    }
  );
};

// ========================================
// FIND DRIVER
// ========================================

export const findDriverById = async (
  id: number
) => {
  return prisma.driverProfile.findUnique({
    where: {
      id,
    },

    include: {
      user: true,

      experience: true,

      Vehicle: true,

      documents: true,

      services: true,
    },
  });
};

// ========================================
// UPDATE DRIVER
// ========================================

export const updateDriver = async (
  id: number,
  data: any
) => {
  return prisma.driverProfile.update({
    where: {
      id,
    },

    data,
  });
};

// ========================================
// GET DRIVER SERVICES
// ========================================

export const findDriverServices = async (
  driverProfileId: number
) => {
  return prisma.driverService.findMany({
    where: {
      driverId: driverProfileId,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

// ========================================
// UPDATE DRIVER SERVICES
// ========================================

export const updateDriverServices = async (
  driverProfileId: number,
  services: string[]
) => {
  return prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // ------------------------------------
      // Remove previous selections
      // ------------------------------------

      await tx.driverService.deleteMany({
        where: {
          driverId: driverProfileId,
        },
      });

      // ------------------------------------
      // Save selected services
      // ------------------------------------

      if (services.length > 0) {
        await tx.driverService.createMany({
          data: services.map(
            (service) => ({
              driverId:
                driverProfileId,

              serviceType:
                service as any,
            })
          ),
        });
      }

      // ------------------------------------
      // Move to Step 3
      // ------------------------------------

      const driverProfile =
        await tx.driverProfile.update({
          where: {
            id: driverProfileId,
          },

          data: {
            onboardingStep: 3,

            onboardingCompleted: false,
          },

          include: {
            services: true,
          },
        });

      return driverProfile;
    }
  );
};

// ========================================
// UPDATE DRIVER DETAILS
// ========================================

export const updateDriverDetails = async (
  driverProfileId: number,
  data: {
    dob: string;
    gender: string;
    aadhaar: string;
    licenceNumber: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    experience: string;
    workedPlatforms?: string[];
    languages?: string[];
  }
) => {
  return prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // ------------------------------------
      // Update Driver Profile
      // ------------------------------------

      await tx.driverProfile.update({
        where: {
          id: driverProfileId,
        },

        data: {
          dob: new Date(data.dob),

          gender: data.gender,

          aadhaar: data.aadhaar,

          licenceNumber:
            data.licenceNumber,

          address: data.address,

          district: data.district,

          state: data.state,

          pincode: data.pincode,

          onboardingStep: 5,

          onboardingCompleted: false,
        },
      });

      // ------------------------------------
      // Update Driver Experience
      // ------------------------------------

      await tx.driverExperience.upsert({
        where: {
          driverProfileId,
        },

        update: {
          experience:
            data.experience,

          workedPlatforms:
            data.workedPlatforms ?? [],

          languages:
            data.languages ?? [],
        },

        create: {
          driverProfileId,

          experience:
            data.experience,

          workedPlatforms:
            data.workedPlatforms ?? [],

          languages:
            data.languages ?? [],
        },
      });

      // ------------------------------------
      // Return Updated Driver
      // ------------------------------------

      return tx.driverProfile.findUnique({
        where: {
          id: driverProfileId,
        },

        include: {
          experience: true,

          services: true,

          Vehicle: true,
        },
      });
    }
  );
};

// ========================================
// SUBMIT DRIVER ONBOARDING
// ========================================

export const submitDriverOnboarding = async (
  driverProfileId: number
) => {
  return prisma.driverProfile.update({
    where: {
      id: driverProfileId,
    },

    data: {
      onboardingStep: 7,

      onboardingCompleted: true,

      driverStatus:
        DriverStatus.PENDING,
    },

    include: {
      user: true,

      experience: true,

      Vehicle: true,

      documents: true,

      services: true,
    },
  });
};

// ========================================
// GET NEARBY ONLINE RIDERS
// ========================================
//
// Used by Driver Dashboard.
//
// Checks:
// 1. Driver is online
// 2. Driver has recent lastSeen
// 3. Driver has current latitude
// 4. Driver has current longitude
//
// Distance is calculated in service layer.
// ========================================

export const findNearbyOnlineDrivers = async (
  sessionCutoff: Date
) => {
  return prisma.driverProfile.findMany({
    where: {
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
    },

    select: {
      id: true,

      user: {
        select: {
          id: true,
          fullName: true,
        },
      },

      availability: {
        select: {
          isOnline: true,
          lastSeen: true,
          currentLatitude: true,
          currentLongitude: true,
        },
      },

      Vehicle: {
        where: {
          isActive: true,
        },

        orderBy: [
          {
            isDefault: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        take: 1,

        select: {
          id: true,
          registrationNumber: true,
          vehicleType: true,
          make: true,
          model: true,
        },
      },

      services: {
        select: {
          serviceType: true,
        },
      },
    },
  });
};