import * as bookingService from "./booking.service.js";
// ============================================================
// CREATE BOOKING
// ============================================================
export const createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking({
            ...req.body,
            passengerId: req.user.id,
        });
        return res.status(201).json({
            success: true,
            data: booking,
        });
    }
    catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to create booking.",
        });
    }
};
// ============================================================
// GET BOOKING
// ============================================================
export const getBooking = async (req, res) => {
    try {
        const booking = await bookingService.getBooking(Number(req.params.id));
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: booking,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
