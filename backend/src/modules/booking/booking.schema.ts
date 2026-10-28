import * as BookingSelectionService from "./booking.selection.service.js";

// ============================================================
// GET AVAILABLE DRIVERS
// ============================================================

export const getAvailableDrivers = async (
  pickupLatitude: number,
  pickupLongitude: number,
  serviceType?: string,
  vehicleType?: string
) => {
  return BookingSelectionService.getAvailableDrivers(
    pickupLatitude,
    pickupLongitude,
    serviceType,
    vehicleType
  );
};