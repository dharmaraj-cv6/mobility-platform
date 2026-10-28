import prisma from "../../database/prisma.js";

import {
  Prisma,
} from "@prisma/client";

class OtpRepository {
  // ============================================================
  // CREATE OTP
  // ============================================================

  async create(
    userId: number,
    codeHash: string,
    expiresAt: Date,
    db?: Prisma.TransactionClient
  ) {
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

  async findLatestByUserId(
    userId: number
  ) {
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

  async markVerified(
    id: number
  ) {
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

  async incrementAttempts(
    id: number
  ) {
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