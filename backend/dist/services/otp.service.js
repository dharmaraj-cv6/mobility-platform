import bcrypt from "bcrypt";
import otpRepository from "../repositories/auth/otp.repository.js";
const OTP_EXPIRY_MINUTES = 5;
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
export const createOtp = async (userId, db) => {
    const otp = generateOtp();
    const codeHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() +
        OTP_EXPIRY_MINUTES * 60 * 1000);
    await otpRepository.create(userId, codeHash, expiresAt, db);
    // Development only
    console.log(`OTP for user ${userId}: ${otp}`);
    return {
        expiresAt,
    };
};
export const verifyOtpCode = async (userId, otp) => {
    const record = await otpRepository.findLatestByUserId(userId);
    if (!record) {
        throw new Error("OTP not found");
    }
    if (record.expiresAt < new Date()) {
        throw new Error("OTP expired");
    }
    if (record.attempts >= 5) {
        throw new Error("Too many incorrect attempts");
    }
    const valid = await bcrypt.compare(otp, record.codeHash);
    if (!valid) {
        await otpRepository.incrementAttempts(record.id);
        throw new Error("Invalid OTP");
    }
    await otpRepository.markVerified(record.id);
    return true;
};
