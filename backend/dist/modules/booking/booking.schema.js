import * as BookingSelectionService from "./booking.selection.service.js";
// ============================================================
// GET AVAILABLE DRIVERS
// ============================================================
export const getAvailableDrivers = async (pickupLatitude, pickupLongitude, serviceType, vehicleType) => {
    return BookingSelectionService.getAvailableDrivers(pickupLatitude, pickupLongitude, serviceType, vehicleType);
};
