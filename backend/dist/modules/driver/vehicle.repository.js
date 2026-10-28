import prisma from "../../config/prisma.js";
// ========================================
// FIND VEHICLE BY REGISTRATION
// ========================================
export const findByRegistration = async (registrationNumber) => {
    return prisma.vehicle.findUnique({
        where: {
            registrationNumber,
        },
    });
};
// ========================================
// FIND VEHICLE BY ID
// ========================================
export const findById = async (id) => {
    return prisma.vehicle.findUnique({
        where: {
            id,
        },
        include: {
            documents: true,
        },
    });
};
// ========================================
// GET VEHICLE BY ID + DRIVER
// ========================================
export const getVehicleById = async (vehicleId, driverProfileId) => {
    return prisma.vehicle.findFirst({
        where: {
            id: vehicleId,
            driverProfileId,
        },
        include: {
            documents: true,
        },
    });
};
// ========================================
// FIND DRIVER VEHICLES
// ========================================
export const findByDriverProfileId = async (driverProfileId) => {
    return prisma.vehicle.findMany({
        where: {
            driverProfileId,
        },
        include: {
            documents: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
// ========================================
// CREATE VEHICLE
// ========================================
export const createVehicle = async (driverProfileId, data) => {
    return prisma.vehicle.create({
        data: {
            driverProfileId,
            vehicleType: data.vehicleType,
            // vehicleNumber is required
            vehicleNumber: data.registrationNumber,
            brand: data.brand,
            model: data.model,
            registrationNumber: data.registrationNumber,
            manufacturingYear: data.manufacturingYear,
            fuelType: data.fuelType,
            seatCapacity: data.seatCapacity,
            color: data.color,
            isActive: true,
            isDefault: data.isDefault ?? false,
        },
    });
};
// ========================================
// SET DEFAULT VEHICLE
// ========================================
export const setDefaultVehicle = async (driverProfileId, vehicleId) => {
    return prisma.$transaction(async (tx) => {
        // Remove default from all driver's vehicles
        await tx.vehicle.updateMany({
            where: {
                driverProfileId,
            },
            data: {
                isDefault: false,
            },
        });
        // Set selected vehicle as default
        return tx.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                isDefault: true,
            },
        });
    });
};
export const updateVerificationStatus = async (vehicleId, status) => {
    return prisma.vehicle.update({
        where: {
            id: vehicleId,
        },
        data: {
            verificationStatus: status,
        },
    });
};
