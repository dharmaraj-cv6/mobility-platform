import prisma from "../../config/prisma.js";
// ========================================
// CONSTANTS
// ========================================
const DEFAULT_RADIUS_KM = 5;
const MAX_RADIUS_KM = 50;
// ========================================
// DISTANCE
// ========================================
const toRadians = (value) => {
    return (value * Math.PI) / 180;
};
const calculateDistanceKm = (latitude1, longitude1, latitude2, longitude2) => {
    const earthRadiusKm = 6371;
    const dLatitude = toRadians(latitude2 - latitude1);
    const dLongitude = toRadians(longitude2 - longitude1);
    const a = Math.sin(dLatitude / 2) *
        Math.sin(dLatitude / 2) +
        Math.cos(toRadians(latitude1)) *
            Math.cos(toRadians(latitude2)) *
            Math.sin(dLongitude / 2) *
            Math.sin(dLongitude / 2);
    const c = 2 *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};
// ========================================
// GET NEARBY RIDERS
// ========================================
//
// Driver dashboard uses this endpoint to
// display nearby passenger booking demand.
//
// IMPORTANT:
// There is NO rideRequest model.
//
// Passenger demand is stored in:
//
// Booking
//
// and driver distribution is tracked by:
//
// BookingDriverLead
// ========================================
export const getNearbyRidersService = async (userId, radiusInput) => {
    const radiusKm = Number.isFinite(radiusInput) &&
        Number(radiusInput) > 0
        ? Math.min(Number(radiusInput), MAX_RADIUS_KM)
        : DEFAULT_RADIUS_KM;
    // ======================================
    // FIND DRIVER
    // ======================================
    const driver = await prisma.driverProfile.findUnique({
        where: {
            userId,
        },
        include: {
            availability: true,
        },
    });
    if (!driver) {
        throw new Error("Driver profile not found.");
    }
    // ======================================
    // DRIVER CURRENT LOCATION
    // ======================================
    const driverLatitude = driver.availability?.currentLatitude;
    const driverLongitude = driver.availability?.currentLongitude;
    if (driverLatitude === null ||
        driverLatitude === undefined ||
        driverLongitude === null ||
        driverLongitude === undefined) {
        return [];
    }
    // ======================================
    // GET ACTIVE BOOKING REQUESTS
    // ======================================
    //
    // Booking is the actual passenger request
    // model in your Prisma schema.
    //
    // We only expose bookings which are still
    // waiting for driver selection/response.
    // ======================================
    const bookings = await prisma.booking.findMany({
        where: {
            status: "REQUEST_SENT",
            pickupLatitude: {
                not: null,
            },
            pickupLongitude: {
                not: null,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 100,
        select: {
            id: true,
            pickupAddress: true,
            pickupLatitude: true,
            pickupLongitude: true,
            dropAddress: true,
            dropLatitude: true,
            dropLongitude: true,
            rideType: true,
            vehicleType: true,
            serviceZone: true,
            estimatedDistance: true,
            estimatedFare: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            passengerId: true,
        },
    });
    // ======================================
    // CALCULATE DISTANCE
    // ======================================
    const nearbyRiders = bookings
        .map((booking) => {
        const pickupLatitude = booking.pickupLatitude;
        const pickupLongitude = booking.pickupLongitude;
        if (pickupLatitude === null ||
            pickupLatitude === undefined ||
            pickupLongitude === null ||
            pickupLongitude === undefined) {
            return null;
        }
        const distanceKm = calculateDistanceKm(driverLatitude, driverLongitude, pickupLatitude, pickupLongitude);
        if (distanceKm > radiusKm) {
            return null;
        }
        return {
            id: booking.id,
            bookingId: booking.id,
            passengerId: booking.passengerId,
            pickupAddress: booking.pickupAddress,
            pickupLatitude,
            pickupLongitude,
            dropAddress: booking.dropAddress,
            dropLatitude: booking.dropLatitude,
            dropLongitude: booking.dropLongitude,
            rideType: booking.rideType,
            vehicleType: booking.vehicleType,
            serviceZone: booking.serviceZone,
            estimatedDistance: booking.estimatedDistance,
            estimatedFare: booking.estimatedFare,
            status: booking.status,
            distanceKm: Number(distanceKm.toFixed(2)),
            createdAt: booking.createdAt,
        };
    })
        .filter((rider) => rider !== null)
        .sort((a, b) => a.distanceKm -
        b.distanceKm);
    return nearbyRiders;
};
