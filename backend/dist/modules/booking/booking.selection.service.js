import { getAvailableDriversRepository, } from "./booking.selection.repository.js";
// ============================================================
// GET AVAILABLE DRIVERS
// ============================================================
//
// Flow:
//
// Home service selection
//        ↓
// Booking page
//        ↓
// pickup latitude + longitude
//        ↓
// selected service type
//        ↓
// repository finds online nearby drivers
//
// Vehicle filtering is handled HERE.
// Repository accepts only:
//
// 1. pickupLatitude
// 2. pickupLongitude
// 3. serviceType
//
// IMPORTANT:
// Do NOT pass vehicleType to the repository.
// ============================================================
export const getAvailableDrivers = async (pickupLatitude, pickupLongitude, serviceType, vehicleType) => {
    // ----------------------------------------------------------
    // VALIDATE PICKUP
    // ----------------------------------------------------------
    if (!Number.isFinite(pickupLatitude) ||
        !Number.isFinite(pickupLongitude)) {
        throw new Error("Valid pickup latitude and longitude are required.");
    }
    // ----------------------------------------------------------
    // NORMALIZE SERVICE
    // ----------------------------------------------------------
    const normalizedServiceType = serviceType
        ?.trim()
        .toUpperCase();
    // ----------------------------------------------------------
    // NORMALIZE VEHICLE
    // ----------------------------------------------------------
    const normalizedVehicleType = vehicleType
        ?.trim()
        .toUpperCase();
    // ----------------------------------------------------------
    // GET AVAILABLE DRIVERS
    //
    // IMPORTANT:
    //
    // Repository accepts ONLY 3 arguments.
    //
    // pickupLatitude
    // pickupLongitude
    // serviceType
    //
    // Do NOT pass normalizedVehicleType here.
    // ----------------------------------------------------------
    const result = await getAvailableDriversRepository(pickupLatitude, pickupLongitude, normalizedServiceType);
    // ----------------------------------------------------------
    // NO VEHICLE FILTER
    // ----------------------------------------------------------
    if (!normalizedVehicleType ||
        normalizedVehicleType === "ALL") {
        return result;
    }
    // ----------------------------------------------------------
    // NO VEHICLE FILTER
    // ----------------------------------------------------------
    if (!normalizedVehicleType ||
        normalizedVehicleType === "ALL") {
        return result;
    }
    // ----------------------------------------------------------
    // VEHICLE FILTER
    // Preserve the repository response structure.
    // ----------------------------------------------------------
    return {
        ...result,
        drivers: result.drivers.filter((driver) => {
            const driverVehicleType = String(driver.vehicle?.vehicleType || "")
                .trim()
                .toUpperCase();
            // CAB_4 represents the normal cab category.
            if (normalizedVehicleType === "CAB_4") {
                return (driverVehicleType === "CAB_4" ||
                    driverVehicleType === "CAB");
            }
            // Traveller category.
            if (normalizedVehicleType === "TRAVELLER") {
                return (driverVehicleType === "TRAVELLER" ||
                    driverVehicleType === "TEMPO" ||
                    driverVehicleType === "VAN");
            }
            return driverVehicleType === normalizedVehicleType;
        }),
    };
};
