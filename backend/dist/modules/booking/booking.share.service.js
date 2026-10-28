import * as BookingShareRepository from "./booking.share.repository.js";
export const shareBooking = async (bookingId, nextDriverId) => {
    const booking = await BookingShareRepository.findBooking(bookingId);
    if (!booking) {
        throw new Error("Booking not found.");
    }
    if (booking.driverShareCount >= 1) {
        throw new Error("This ride has already been shared.");
    }
    return BookingShareRepository.shareBooking(bookingId, nextDriverId);
};
