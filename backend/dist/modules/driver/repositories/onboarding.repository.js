import prisma from "../../../config/prisma.js";
// ============================================================
// SUBMIT DRIVER ONBOARDING
//
// Flow:
//
// Driver
//   ↓
// DriverProfile = PENDING
//   ↓
// Vehicle = PENDING
//   ↓
// UserRequest = PENDING
//   ↓
// Admin Review
// ============================================================
export const submitOnboarding = async (userId, data) => {
    return prisma.$transaction(async (tx) => {
        // ========================================================
        // 1. DRIVER PROFILE
        // ========================================================
        const driverProfile = await tx.driverProfile.upsert({
            where: {
                userId,
            },
            update: {
                dob: data.driver.dob,
                gender: data.driver.gender,
                aadhaar: data.driver.aadhaar,
                licenceNumber: data.driver.licenceNumber,
                address: data.driver.address,
                district: data.driver.district,
                state: data.driver.state,
                pincode: data.driver.pincode,
                businessType: data.driver.businessType,
                // New onboarding submission
                // always goes back for admin review.
                driverStatus: "PENDING",
                onboardingStep: 4,
                onboardingCompleted: true,
                verifiedBy: null,
                verifiedAt: null,
            },
            create: {
                userId,
                dob: data.driver.dob,
                gender: data.driver.gender,
                aadhaar: data.driver.aadhaar,
                licenceNumber: data.driver.licenceNumber,
                address: data.driver.address,
                district: data.driver.district,
                state: data.driver.state,
                pincode: data.driver.pincode,
                businessType: data.driver.businessType,
                driverStatus: "PENDING",
                onboardingStep: 4,
                onboardingCompleted: true,
            },
        });
        // ========================================================
        // 2. MAKE EXISTING DEFAULT VEHICLE NON-DEFAULT
        // ========================================================
        await tx.vehicle.updateMany({
            where: {
                driverProfileId: driverProfile.id,
                isDefault: true,
            },
            data: {
                isDefault: false,
            },
        });
        // ========================================================
        // 3. CREATE NEW VEHICLE
        // ========================================================
        await tx.vehicle.create({
            data: {
                driverProfileId: driverProfile.id,
                vehicleType: data.vehicle.vehicleType,
                vehicleNumber: data.vehicle.vehicleNumber,
                model: data.vehicle.model,
                seatCapacity: data.vehicle.seatCapacity,
                brand: data.vehicle.brand,
                registrationNumber: data.vehicle.registrationNumber,
                manufacturingYear: data.vehicle.manufacturingYear,
                fuelType: data.vehicle.fuelType,
                color: data.vehicle.color,
                isActive: true,
                isDefault: true,
                verificationStatus: "PENDING",
            },
        });
        // ========================================================
        // 4. CREATE OR RESET ADMIN USER REQUEST
        // ========================================================
        const existingRequest = await tx.userRequest.findFirst({
            where: {
                userId,
                requestType: "DRIVER",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (existingRequest) {
            await tx.userRequest.update({
                where: {
                    id: existingRequest.id,
                },
                data: {
                    requestType: "DRIVER",
                    businessType: data.driver.businessType,
                    status: "PENDING",
                    reviewedAt: null,
                    reviewedBy: null,
                    reviewNote: null,
                },
            });
        }
        else {
            await tx.userRequest.create({
                data: {
                    userId,
                    requestType: "DRIVER",
                    businessType: data.driver.businessType,
                    status: "PENDING",
                },
            });
        }
        // ========================================================
        // 5. DRIVER MUST ALWAYS START OFFLINE
        // ========================================================
        await tx.driverAvailability.upsert({
            where: {
                driverProfileId: driverProfile.id,
            },
            update: {
                isOnline: false,
                currentLatitude: null,
                currentLongitude: null,
                lastSeen: null,
            },
            create: {
                driverProfileId: driverProfile.id,
                isOnline: false,
            },
        });
        // ========================================================
        // 6. RETURN COMPLETE DRIVER PROFILE
        // ========================================================
        return tx.driverProfile.findUnique({
            where: {
                id: driverProfile.id,
            },
            include: {
                Vehicle: true,
                documents: true,
                availability: true,
                experience: true,
            },
        });
    });
};
export default {
    submitOnboarding,
};
