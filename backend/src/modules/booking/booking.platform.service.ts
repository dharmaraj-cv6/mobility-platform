import * as PlatformRepository from "./booking.platform.repository.js";

export const moveToPlatform = async (
  bookingId: number
) => {
  return await PlatformRepository.moveToPlatform(
    bookingId
  );
};