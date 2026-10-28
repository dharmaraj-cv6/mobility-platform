import * as PaymentService from "./driver.payment.service.js";
export const getPaymentProfile = async (req, res) => {
    try {
        const profile = await PaymentService.getPaymentProfile(req.user.id);
        res.json({
            success: true,
            data: profile,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};
export const savePaymentProfile = async (req, res) => {
    try {
        const profile = await PaymentService.savePaymentProfile(req.user.id, req.body);
        res.json({
            success: true,
            message: "Payment profile updated successfully.",
            data: profile,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};
