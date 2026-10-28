import prisma from "../../../../config/prisma.js";
// ============================================================
// DRIVER REQUEST TYPES
//
// These request types create/use a DriverProfile.
// ============================================================
const DRIVER_REQUEST_TYPES = [
    "DRIVER",
    "OWNER_CUM_DRIVER",
];
// ============================================================
// CREATE USER REQUEST
// ============================================================
export const createUserRequest = async (userId, requestType, businessType) => {
    return prisma.userRequest.create({
        data: {
            userId,
            requestType,
            businessType,
            status: "PENDING",
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            },
        },
    });
};
// ============================================================
// GET ALL USER REQUESTS
// ============================================================
export const getUserRequests = async () => {
    return prisma.userRequest.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
// ============================================================
// GET USER REQUESTS BY STATUS
// ============================================================
export const getUserRequestsByStatus = async (status) => {
    return prisma.userRequest.findMany({
        where: {
            status,
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
// ============================================================
// GET USER REQUEST BY ID
// ============================================================
export const getUserRequestById = async (id) => {
    return prisma.userRequest.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    driverProfile: {
                        include: {
                            Vehicle: true,
                            services: true,
                            documents: true,
                            availability: true,
                            experience: true,
                            paymentProfile: true,
                        },
                    },
                    passengerProfile: true,
                },
            },
        },
    });
};
// ============================================================
// UPDATE USER REQUEST STATUS
//
// IMPORTANT:
//
// UserRequest.status is the review/request status.
//
// DriverProfile.driverStatus is the driver's actual
// approval status used by the driver-side application.
//
// Vehicle.verificationStatus is the vehicle's actual
// admin verification status.
//
// APPROVE:
//   UserRequest.status          -> APPROVED
//   DriverProfile.driverStatus  -> VERIFIED
//   Vehicle.verificationStatus  -> APPROVED
//
// HOLD:
//   UserRequest.status          -> ON_HOLD
//   DriverProfile.driverStatus  -> PENDING
//   Vehicle.verificationStatus  -> PENDING
//
// REJECT:
//   UserRequest.status          -> REJECTED
//   DriverProfile.driverStatus  -> REJECTED
//   Vehicle.verificationStatus  -> REJECTED
//
// Everything is handled inside one transaction.
// ============================================================
export const updateUserRequestStatus = async (id, status, reviewedBy, reviewNote) => {
    // ----------------------------------------------------------
    // Find current request
    // ----------------------------------------------------------
    const currentRequest = await prisma.userRequest.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            userId: true,
            requestType: true,
        },
    });
    if (!currentRequest) {
        throw new Error("User request not found.");
    }
    // ----------------------------------------------------------
    // Check whether this is a driver request
    // ----------------------------------------------------------
    const isDriverRequest = DRIVER_REQUEST_TYPES.includes(currentRequest.requestType);
    // ----------------------------------------------------------
    // TRANSACTION
    // ----------------------------------------------------------
    return prisma.$transaction(async (tx) => {
        // ======================================================
        // 1. UPDATE USER REQUEST
        // ======================================================
        const updatedRequest = await tx.userRequest.update({
            where: {
                id,
            },
            data: {
                status,
                reviewedBy,
                reviewedAt: new Date(),
                reviewNote,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        role: true,
                        isActive: true,
                        driverProfile: {
                            select: {
                                id: true,
                                driverStatus: true,
                                onboardingCompleted: true,
                                verifiedBy: true,
                                verifiedAt: true,
                            },
                        },
                    },
                },
            },
        });
        // ======================================================
        // 2. DRIVER + VEHICLE APPROVAL
        // ======================================================
        if (isDriverRequest) {
            // ----------------------------------------------------
            // Find Driver Profile
            // ----------------------------------------------------
            const driverProfile = await tx.driverProfile.findUnique({
                where: {
                    userId: currentRequest.userId,
                },
                select: {
                    id: true,
                },
            });
            if (!driverProfile) {
                throw new Error("Driver profile not found for this request.");
            }
            // ====================================================
            // APPROVED
            //
            // Driver -> VERIFIED
            // Vehicle -> APPROVED
            // ====================================================
            if (status ===
                "APPROVED") {
                // --------------------------------------------------
                // Approve Driver
                // --------------------------------------------------
                await tx.driverProfile.update({
                    where: {
                        id: driverProfile.id,
                    },
                    data: {
                        driverStatus: "VERIFIED",
                        verifiedBy: reviewedBy,
                        verifiedAt: new Date(),
                        onboardingCompleted: true,
                    },
                });
                // --------------------------------------------------
                // Approve ALL vehicles belonging to this driver
                // --------------------------------------------------
                await tx.vehicle.updateMany({
                    where: {
                        driverProfileId: driverProfile.id,
                    },
                    data: {
                        verificationStatus: "APPROVED",
                    },
                });
            }
            // ====================================================
            // ON HOLD
            //
            // Driver -> PENDING
            // Vehicle -> PENDING
            // ====================================================
            if (status ===
                "ON_HOLD") {
                // --------------------------------------------------
                // Keep Driver unverified
                // --------------------------------------------------
                await tx.driverProfile.update({
                    where: {
                        id: driverProfile.id,
                    },
                    data: {
                        driverStatus: "PENDING",
                        verifiedBy: null,
                        verifiedAt: null,
                    },
                });
                // --------------------------------------------------
                // Keep vehicles pending
                // --------------------------------------------------
                await tx.vehicle.updateMany({
                    where: {
                        driverProfileId: driverProfile.id,
                    },
                    data: {
                        verificationStatus: "PENDING",
                    },
                });
            }
            // ====================================================
            // REJECTED
            //
            // Driver -> REJECTED
            // Vehicle -> REJECTED
            // ====================================================
            if (status ===
                "REJECTED") {
                // --------------------------------------------------
                // Reject Driver
                // --------------------------------------------------
                await tx.driverProfile.update({
                    where: {
                        id: driverProfile.id,
                    },
                    data: {
                        driverStatus: "REJECTED",
                        verifiedBy: reviewedBy,
                        verifiedAt: new Date(),
                    },
                });
                // --------------------------------------------------
                // Reject ALL vehicles belonging to this driver
                // --------------------------------------------------
                await tx.vehicle.updateMany({
                    where: {
                        driverProfileId: driverProfile.id,
                    },
                    data: {
                        verificationStatus: "REJECTED",
                    },
                });
            }
        }
        // ======================================================
        // 3. RETURN FRESH REQUEST DATA
        // ======================================================
        return tx.userRequest.findUnique({
            where: {
                id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        role: true,
                        isActive: true,
                        createdAt: true,
                        driverProfile: {
                            include: {
                                Vehicle: true,
                                services: true,
                                documents: true,
                                availability: true,
                                experience: true,
                                paymentProfile: true,
                            },
                        },
                        passengerProfile: true,
                    },
                },
            },
        });
    });
};
// ============================================================
// FIND PENDING REQUEST
// ============================================================
export const findPendingRequest = async (userId, requestType) => {
    return prisma.userRequest.findFirst({
        where: {
            userId,
            requestType,
            status: "PENDING",
        },
    });
};
