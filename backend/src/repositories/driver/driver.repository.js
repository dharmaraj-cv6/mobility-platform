// ========================================
// GET DRIVER SERVICES
// ========================================

export const findDriverServices = async (
  driverProfileId
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
  driverProfileId,
  services
) => {
  return prisma.$transaction(
    async (tx) => {
      // Remove previous selections
      await tx.driverService.deleteMany({
        where: {
          driverId: driverProfileId,
        },
      });

      // Add new selections
      if (services.length > 0) {
        await tx.driverService.createMany({
          data: services.map((service) => ({
            driverId: driverProfileId,
            serviceType: service,
          })),
        });
      }

      // Move to Step 2
      return tx.driverProfile.update({
        where: {
          id: driverProfileId,
        },

        data: {
          onboardingStep: 2,
          onboardingCompleted: false,
        },

        include: {
          services: true,
        },
      });
    }
  );
};