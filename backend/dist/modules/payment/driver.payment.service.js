import * as DriverRepository from "../driver/driver.repository.js";
import * as PaymentRepository from "./driver.payment.repository.js";
export const getPaymentProfile = async (userId) => {
    const driver = await DriverRepository.findDriverByUserId(userId);
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    return PaymentRepository.getPaymentProfile(driver.id);
};
export const savePaymentProfile = async (userId, data) => {
    const driver = await DriverRepository.findDriverByUserId(userId);
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    return PaymentRepository.upsertPaymentProfile(driver.id, data);
};
