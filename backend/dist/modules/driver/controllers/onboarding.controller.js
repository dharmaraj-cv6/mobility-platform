import onboardingService from "../services/onboarding.service.js";
const submitOnboarding = async (req, res) => {
    try {
        // ========================================
        // GET AUTHENTICATED USER
        // ========================================
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        // ========================================
        // SUBMIT ONBOARDING
        // ========================================
        const driverProfile = await onboardingService.submitOnboarding(userId, req.body);
        // ========================================
        // RESPONSE
        // ========================================
        return res.status(201).json({
            success: true,
            message: "Driver onboarding submitted successfully. Document verification is in process.",
            data: {
                driverProfile,
                status: "PENDING",
            },
        });
    }
    catch (error) {
        console.error("SUBMIT ONBOARDING ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to submit driver onboarding.",
        });
    }
};
export default {
    submitOnboarding,
};
