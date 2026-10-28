import * as DriverRepository from "../../driver/driver.repository.js";
import * as MyRidesRepository from "./my.rides.repository.js";
// =====================================================
// GET MY RIDES
// =====================================================
export const getMyRides = async (userId) => {
    const driver = await DriverRepository.findDriverByUserId(userId);
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    return MyRidesRepository.getMyRides(driver.id);
};
