import * as BookingRequestService from "./booking.request.service.js";
// ============================================================
// SEND REQUEST TO DRIVER
// ============================================================
export const sendRequestToDriver = async (req, res) => {
    try {
        const { bookingId, driverId } = req.body;
        const booking = await BookingRequestService.sendRequestToDriver(Number(bookingId), Number(driverId));
        return res.status(200).json({
            success: true,
            message: "Booking request sent successfully.",
            data: booking,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong.",
        });
    }
};
// ============================================================
// RESERVE DRIVER FOR 30 SECONDS
// ============================================================
export const reserveDriver = async (req, res) => {
    try {
        const { bookingId, driverId } = req.body;
        if (bookingId === undefined ||
            driverId === undefined) {
            return res.status(400).json({
                success: false,
                message: "bookingId and driverId are required.",
            });
        }
        const booking = await BookingRequestService.reserveDriver(Number(bookingId), Number(driverId));
        return res.status(200).json({
            success: true,
            message: "Driver reserved for 30 seconds.",
            data: booking,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to reserve driver.",
        });
    }
};
