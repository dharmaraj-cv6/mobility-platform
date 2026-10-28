import * as PlatformRepository from "./booking.platform.repository.js";
export const moveToPlatform = async (bookingId) => {
    return await PlatformRepository.moveToPlatform(bookingId);
};
