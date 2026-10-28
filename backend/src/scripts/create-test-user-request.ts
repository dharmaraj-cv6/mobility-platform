import prisma from "../config/prisma.js";

const createTestUserRequest = async () => {
  try {
    // Find an existing driver
    const driver = await prisma.user.findFirst({
      where: {
        role: "DRIVER",
        isActive: true,
      },
    });

    if (!driver) {
      throw new Error(
        "No active DRIVER user found."
      );
    }

    // Check whether this driver already has
    // a pending request
    const existingRequest =
      await prisma.userRequest.findFirst({
        where: {
          userId: driver.id,
          requestType: "DRIVER",
          status: "PENDING",
        },
      });

    if (existingRequest) {
      console.log(
        "Pending driver request already exists:",
        existingRequest.id
      );

      return;
    }

    const request =
      await prisma.userRequest.create({
        data: {
          userId: driver.id,
          requestType: "DRIVER",
          status: "PENDING",
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              role: true,
            },
          },
        },
      });

    console.log(
      "User request created successfully:"
    );

    console.log(request);
  } catch (error) {
    console.error(
      "Failed to create user request:",
      error
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

createTestUserRequest();