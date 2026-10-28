import authRepository from "../repositories/auth/auth.repository.js";
import { generateToken } from "../utils/jwt.js";
import { createOtp, verifyOtpCode, } from "./otp.service.js";
import { getDriverByUserId, } from "../modules/driver/driver.service.js";
// =====================================================
// REGISTER USER
// =====================================================
export const registerUser = async (data) => {
    const existingPhone = await authRepository.findByPhone(data.phone);
    if (existingPhone) {
        throw new Error("Phone number already exists");
    }
    const user = await authRepository.createUser({
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
    });
    await createOtp(user.id);
    return {
        user,
        otpRequired: true,
    };
};
// =====================================================
// LOGIN USER
// =====================================================
export const loginUser = async (data) => {
    const user = await authRepository.findByPhone(data.phone);
    if (!user) {
        throw new Error("No account found with this mobile number");
    }
    if (!user.isActive) {
        throw new Error("Your account is inactive");
    }
    await createOtp(user.id);
    return {
        user,
        otpRequired: true,
    };
};
// =====================================================
// DRIVER ONBOARDING STATUS
// =====================================================
const getDriverOnboardingStatus = async (userId) => {
    const driver = await getDriverByUserId(userId);
    if (!driver) {
        return "NOT_STARTED";
    }
    if (!driver.onboardingCompleted) {
        return "IN_PROGRESS";
    }
    return String(driver.driverStatus);
};
// =====================================================
// VERIFY USER OTP
// =====================================================
export const verifyUserOtp = async (userId, otp) => {
    const user = await authRepository.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.isActive) {
        throw new Error("Your account is inactive");
    }
    await verifyOtpCode(userId, otp);
    const token = generateToken({
        id: user.id,
        role: user.role,
    });
    let onboardingStatus;
    if (user.role === "DRIVER") {
        onboardingStatus =
            await getDriverOnboardingStatus(user.id);
    }
    return {
        user,
        token,
        ...(user.role === "DRIVER"
            ? {
                onboardingStatus,
            }
            : {}),
    };
};
