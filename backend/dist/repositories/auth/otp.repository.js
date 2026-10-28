import prisma from "../../database/prisma.js";
class OtpRepository {
    // ============================================================
    // CREATE OTP
    // ============================================================
    async create(userId, codeHash, expiresAt, db) {
        const client = db ?? prisma;
        await client.otpVerification.deleteMany({
            where: {
                userId,
                verifiedAt: null,
            },
        });
        return client.otpVerification.create({
            data: {
                userId,
                codeHash,
                expiresAt,
            },
        });
    }
    // ============================================================
    // FIND LATEST OTP
    // ============================================================
    async findLatestByUserId(userId) {
        return prisma.otpVerification.findFirst({
            where: {
                userId,
                verifiedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    // ============================================================
    // MARK OTP VERIFIED
    // ============================================================
    async markVerified(id) {
        return prisma.otpVerification.update({
            where: {
                id,
            },
            data: {
                verifiedAt: new Date(),
            },
        });
    }
    // ============================================================
    // INCREMENT OTP ATTEMPTS
    // ============================================================
    async incrementAttempts(id) {
        return prisma.otpVerification.update({
            where: {
                id,
            },
            data: {
                attempts: {
                    increment: 1,
                },
            },
        });
    }
}
export default new OtpRepository();
