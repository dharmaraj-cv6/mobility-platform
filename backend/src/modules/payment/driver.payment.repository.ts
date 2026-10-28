import prisma from "../../config/prisma.js";

export const getPaymentProfile = async (driverId: number) => {
  return prisma.driverPaymentProfile.findUnique({
    where: {
      driverId,
    },
  });
};

export const upsertPaymentProfile = async (
  driverId: number,
  data: {
    upiId?: string;
    mobileNumber?: string;
    acceptCash?: boolean;
    qrEnabled?: boolean;
  }
) => {
  return prisma.driverPaymentProfile.upsert({
    where: {
      driverId,
    },

    create: {
      driverId,
      upiId: data.upiId,
      mobileNumber: data.mobileNumber,
      acceptCash: data.acceptCash ?? true,
      qrEnabled: data.qrEnabled ?? true,
    },

    update: {
      upiId: data.upiId,
      mobileNumber: data.mobileNumber,
      acceptCash: data.acceptCash,
      qrEnabled: data.qrEnabled,
    },
  });
};