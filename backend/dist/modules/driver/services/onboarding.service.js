import { onboardingSchema, } from "../validation/onboarding.validation.js";
import onboardingRepository from "../repositories/onboarding.repository.js";
const submitOnboarding = async (userId, input) => {
    // ========================================
    // VALIDATE INPUT
    // ========================================
    const validatedData = onboardingSchema.parse(input);
    // ========================================
    // SUBMIT ONBOARDING
    // ========================================
    const driverProfile = await onboardingRepository.submitOnboarding(userId, validatedData);
    return driverProfile;
};
export default {
    submitOnboarding,
};
