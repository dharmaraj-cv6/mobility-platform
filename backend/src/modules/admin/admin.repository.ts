import prisma from "../../config/prisma.js";

// =====================================================
// GET ALL ADMIN USERS
// =====================================================

export const getAllAdminUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,

      passengerProfile: {
        select: {
          id: true,
          dob: true,
          gender: true,
          profileImage: true,

          savedAddresses: {
            select: {
              id: true,
              title: true,
              address: true,
              latitude: true,
              longitude: true,
              isDefault: true,
            },
          },
        },
      },

      driverProfile: {
        select: {
          id: true,
          userId: true,

          dob: true,
          gender: true,
          aadhaar: true,
          licenceNumber: true,

          address: true,
          district: true,
          state: true,
          pincode: true,

          businessType: true,
          driverStatus: true,

          onboardingStep: true,
          onboardingCompleted: true,

          verifiedBy: true,
          verifiedAt: true,

          createdAt: true,
          updatedAt: true,

          availability: {
            select: {
              id: true,
              isOnline: true,
              currentLatitude: true,
              currentLongitude: true,
              lastSeen: true,
            },
          },

          experience: {
            select: {
              id: true,
              experience: true,
              workedPlatforms: true,
              languages: true,
            },
          },

          services: {
            select: {
              id: true,
              serviceType: true,
              createdAt: true,
            },
          },

          paymentProfile: {
            select: {
              id: true,
              upiId: true,
              mobileNumber: true,
              acceptCash: true,
              qrEnabled: true,
            },
          },

          documents: {
            select: {
              id: true,
              documentType: true,
              fileUrl: true,
              verificationStatus: true,
              uploadedAt: true,
            },
          },

          Vehicle: {
            select: {
              id: true,
              vehicleType: true,
              vehicleNumber: true,
              model: true,
              seatCapacity: true,

              brand: true,
              registrationNumber: true,
              manufacturingYear: true,
              fuelType: true,
              color: true,

              isActive: true,
              isDefault: true,
              verificationStatus: true,

              createdAt: true,
              updatedAt: true,

              documents: {
                select: {
                  id: true,
                  documentType: true,
                  fileUrl: true,
                  verificationStatus: true,
                  uploadedAt: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// =====================================================
// GET ADMIN USER BY ID
// =====================================================

export const getAdminUserById = async (
  userId: number
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      fullName: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,

      passengerProfile: {
        include: {
          savedAddresses: true,
        },
      },

      driverProfile: {
        include: {
          availability: true,
          experience: true,
          services: true,
          paymentProfile: true,
          documents: true,

          Vehicle: {
            include: {
              documents: true,
            },
          },
        },
      },
    },
  });
};