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
// Driver dashboard calls:
//
// GET /api/driver/riders/nearby?radius=5
//
// This endpoint shows nearby passenger demand.
//
// It DOES NOT accept a booking.
// It DOES NOT assign a driver.
// It only reads active/open Booking records.
//
// ========================================
export const getNearbyRidersService = async (userId, radiusInput) => {
    // ======================================
    // NORMALIZE RADIUS
    // ======================================
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
    // DRIVER GPS LOCATION
    // ======================================
    const driverLatitude = driver.availability
        ?.currentLatitude;
    const driverLongitude = driver.availability
        ?.currentLongitude;
    if (driverLatitude === null ||
        driverLatitude === undefined ||
        driverLongitude === null ||
        driverLongitude === undefined) {
        return [];
    }
    // ======================================
    // GET ACTIVE BOOKINGS
    // ======================================
    //
    // IMPORTANT:
    //
    // Your Prisma schema contains Booking,
    // not RideRequest.
    //
    // Booking has:
    //
    // pickupLatitude
    // pickupLongitude
    // status
    //
    // Therefore use prisma.booking.
    //
    // REQUEST_SENT means the passenger has
    // created a ride request and it is still
    // waiting for driver selection.
    // ======================================
    const bookings = await prisma.booking.findMany({
        where: {
            status: "REQUEST_SENT",
            driverId: null,
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
        include: {
            passenger: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
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
        // ----------------------------------
        // OUTSIDE SELECTED RADIUS
        // ----------------------------------
        if (distanceKm > radiusKm) {
            return null;
        }
        // ----------------------------------
        // RETURN DRIVER DASHBOARD DATA
        // ----------------------------------
        return {
            id: booking.id,
            passenger: booking.passenger,
            pickupAddress: booking.pickupAddress,
            pickupLatitude,
            pickupLongitude,
            dropAddress: booking.dropAddress,
            dropLatitude: booking.dropLatitude,
            dropLongitude: booking.dropLongitude,
            distanceKm: Number(distanceKm.toFixed(2)),
            serviceType: booking.serviceZone,
            rideType: booking.rideType,
            vehicleType: booking.vehicleType,
            estimatedDistance: booking.estimatedDistance,
            estimatedFare: booking.estimatedFare,
            arrivalFilter: booking.arrivalFilter,
            status: booking.status,
            createdAt: booking.createdAt,
        };
    })
        .filter((rider) => rider !== null)
        .sort((a, b) => a.distanceKm -
        b.distanceKm);
    return nearbyRiders;
};
