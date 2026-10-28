import * as BookingConfirmService from "./booking.confirm.service.js";
// ============================================================
// PASSENGER CONFIRM BOOKING
// ============================================================
export const confirmBooking = async (req, res) => {
    try {
        // --------------------------------------------------------
        // AUTHENTICATION
        // --------------------------------------------------------
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        // --------------------------------------------------------
        // REQUEST
        // --------------------------------------------------------
        const bookingId = Number(req.body.bookingId);
        if (!Number.isInteger(bookingId) ||
            bookingId <= 0) {
            res.status(400).json({
                success: false,
                message: "Valid bookingId is required.",
            });
            return;
        }
        // --------------------------------------------------------
        // CONFIRM
        // --------------------------------------------------------
        const booking = await BookingConfirmService.confirmBooking(bookingId, req.user.id);
        // --------------------------------------------------------
        // RESPONSE
        // --------------------------------------------------------
        res.status(200).json({
            success: true,
            message: "Ride confirmed successfully.",
            data: booking,
        });
    }
    catch (error) {
        console.error("CONFIRM BOOKING ERROR:", error);
        const message = error instanceof Error
            ? error.message
            : "Unable to confirm booking.";
        // --------------------------------------------------------
        // DRIVER ALREADY WON / WINDOW EXPIRED
        // --------------------------------------------------------
        if (message.includes("no longer available") ||
            message.includes("decision window has expired")) {
            res.status(409).json({
                success: false,
                message,
                code: message.includes("decision window")
                    ? "DECISION_WINDOW_EXPIRED"
                    : "DRIVER_UNAVAILABLE",
            });
            return;
        }
        res.status(400).json({
            success: false,
            message,
        });
    }
};
