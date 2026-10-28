import prisma from "../../config/prisma.js";
// =====================================================
// DRIVER SERVICE INCLUDE
// =====================================================
const serviceInclude = {
    driverProfile: {
        select: {
            id: true,
            userId: true,
            Vehicle: {
                where: {
                    isDefault: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
                select: {
                    id: true,
                    vehicleType: true,
                    vehicleNumber: true,
                    brand: true,
                    model: true,
                    seatCapacity: true,
                    registrationNumber: true,
                    manufacturingYear: true,
                    fuelType: true,
                    color: true,
                    isActive: true,
                    isDefault: true,
                    verificationStatus: true,
                },
            },
        },
    },
};
// =====================================================
// GET ALL SERVICES
// =====================================================
export const findDriverServices = async (driverProfileId) => {
    return prisma.driverService.findMany({
        where: {
            driverId: driverProfileId,
        },
        include: serviceInclude,
        orderBy: {
            createdAt: "asc",
        },
    });
};
// =====================================================
// GET ONE SERVICE
// =====================================================
export const findDriverService = async (driverProfileId, serviceId) => {
    return prisma.driverService.findFirst({
        where: {
            id: serviceId,
            driverId: driverProfileId,
        },
        include: serviceInclude,
    });
};
// =====================================================
// GET SERVICE BY TYPE
// =====================================================
export const findDriverServiceByType = async (driverProfileId, serviceType) => {
    return prisma.driverService.findUnique({
        where: {
            driverId_serviceType: {
                driverId: driverProfileId,
                serviceType,
            },
        },
        include: serviceInclude,
    });
};
// =====================================================
// UPSERT SERVICE
// =====================================================
export const upsertDriverService = async (driverProfileId, serviceType, fare) => {
    return prisma.driverService.upsert({
        where: {
            driverId_serviceType: {
                driverId: driverProfileId,
                serviceType,
            },
        },
        update: {
            fare,
        },
        create: {
            driverId: driverProfileId,
            serviceType,
            fare,
        },
        include: serviceInclude,
    });
};
// =====================================================
// UPDATE FARE
// =====================================================
export const updateDriverServiceFare = async (driverProfileId, serviceId, fare) => {
    return prisma.driverService.updateMany({
        where: {
            id: serviceId,
            driverId: driverProfileId,
        },
        data: {
            fare,
        },
    });
};
// =====================================================
// DELETE SERVICE
// =====================================================
export const deleteDriverService = async (driverProfileId, serviceId) => {
    return prisma.driverService.deleteMany({
        where: {
            id: serviceId,
            driverId: driverProfileId,
        },
    });
};
