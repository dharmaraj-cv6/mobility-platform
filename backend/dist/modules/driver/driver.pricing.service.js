import * as PricingRepository from "./driver.pricing.repository.js";
import * as DriverRepository from "./driver.repository.js";
export const getDriverPricing = async (userId) => {
    const driver = await DriverRepository.findDriverByUserId(userId);
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    return PricingRepository.findByDriverId(userId);
};
// ========================================
// SAVE DRIVER PRICING
// ========================================
export const saveDriverPricing = async (userId, data) => {
    const driver = await DriverRepository.findDriverByUserId(userId);
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    // --------------------------------------
    // Save pricing
    // --------------------------------------
    const pricing = await PricingRepository.upsertDriverPricing(userId, data);
    // --------------------------------------
    // Move to Step 6
    // --------------------------------------
    await PricingRepository.updateOnboardingStep(userId);
    return pricing;
};
