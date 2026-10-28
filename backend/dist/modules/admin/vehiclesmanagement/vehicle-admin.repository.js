import prisma from "../../../config/prisma.js";
import { VerificationTarget, } from "@prisma/client";
// =====================================================
// FIND VEHICLE
// =====================================================
export const findVehicleById = async (vehicleId) => {
    return prisma.vehicle.findUnique({
        where: {
            id: vehicleId,
        },
        select: {
            id: true,
            driverProfileId: true,
            verificationStatus: true,
            registrationNumber: true,
            vehicleNumber: true,
        },
    });
};
// =====================================================
// UPDATE VEHICLE VERIFICATION STATUS
// =====================================================
export const updateVehicleVerificationStatus = async (vehicleId, adminId, status, remarks) => {
    return prisma.$transaction(async (tx) => {
        const vehicle = await tx.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                verificationStatus: status,
            },
        });
        await tx.adminVerificationLog.create({
            data: {
                adminId,
                vehicleId,
                target: VerificationTarget.VEHICLE,
                status,
                remarks: remarks || null,
            },
        });
        return vehicle;
    });
};
