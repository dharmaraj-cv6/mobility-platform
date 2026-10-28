import prisma from "../../config/prisma.js";
// ============================================================
// CONSTANTS
// ============================================================
const ONLINE_SESSION_MINUTES = 45;
const INITIAL_RADIUS_KM = 3;
const MAX_RADIUS_KM = 11;
const RADIUS_STEP_KM = 2;
// ============================================================
// HAVERSINE DISTANCE
// ============================================================
//
// Calculates distance between:
// passenger pickup
// and
// driver current location
//
// Result: kilometers
// ============================================================
const calculateDistanceKm = (latitude1, longitude1, latitude2, longitude2) => {
    const earthRadiusKm = 6371;
    const toRadians = (value) => {
        return ((value * Math.PI) / 180);
    };
    const latitudeDifference = toRadians(latitude2 - latitude1);
    const longitudeDifference = toRadians(longitude2 - longitude1);
    const a = Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
        Math.cos(toRadians(latitude1)) *
            Math.cos(toRadians(latitude2)) *
            Math.sin(longitudeDifference / 2) *
            Math.sin(longitudeDifference / 2);
    const c = 2 *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};
// ============================================================
// GET AVAILABLE DRIVERS
// ============================================================
//
// Booking Selection checks:
//
// 1. Driver is online
// 2. Driver session is within 45 minutes
// 3. Driver has current latitude
// 4. Driver has current longitude
// 5. Driver provides requested service
// 6. Driver is within the search radius
//
// NOT checked here:
//
// - Reservation
// - Booking state
// - Onboarding
// - Verification
// - Fare configuration
// - Vehicle verification
//
// Those belong to their respective domains.
// ============================================================
export const getAvailableDriversRepository = async (pickupLatitude, pickupLongitude, serviceType) => {
    const now = new Date();
    const sessionCutoff = new Date(now.getTime() -
        ONLINE_SESSION_MINUTES *
            60 *
            1000);
    const normalizedServiceType = serviceType?.trim().toUpperCase();
    // ----------------------------------------------------------
    // BASE FILTER
    // ----------------------------------------------------------
    const where = {
        availability: {
            isOnline: true,
            lastSeen: {
                gte: sessionCutoff,
            },
            currentLatitude: {
                not: null,
            },
            currentLongitude: {
                not: null,
            },
        },
    };
    // ----------------------------------------------------------
    // SERVICE FILTER
    // ----------------------------------------------------------
    if (normalizedServiceType) {
        where.services = {
            some: {
                serviceType: normalizedServiceType,
            },
        };
    }
    // ----------------------------------------------------------
    // FETCH ONLINE DRIVERS
    // ----------------------------------------------------------
    const drivers = await prisma.driverProfile.findMany({
        where,
        include: {
            availability: true,
            user: {
                select: {
                    id: true,
                    fullName: true,
                    isActive: true,
                },
            },
            Vehicle: {
                where: {
                    isActive: true,
                },
                orderBy: {
                    isDefault: "desc",
                },
            },
            services: true,
        },
        orderBy: {
            id: "asc",
        },
    });
    // ----------------------------------------------------------
    // DISTANCE FILTER
    // ----------------------------------------------------------
    const driversWithDistance = drivers
        .map((driver) => {
        const latitude = driver.availability
            ?.currentLatitude;
        const longitude = driver.availability
            ?.currentLongitude;
        if (latitude == null ||
            longitude == null) {
            return null;
        }
        const distanceKm = calculateDistanceKm(pickupLatitude, pickupLongitude, latitude, longitude);
        return {
            ...driver,
            distanceKm,
        };
    })
        .filter((driver) => driver !== null);
    // ----------------------------------------------------------
    // EXPANDING SEARCH RADIUS
    // ----------------------------------------------------------
    //
    // 3 km
    // 5 km
    // 7 km
    // 9 km
    // 11 km
    //
    // The first radius containing drivers wins.
    // ----------------------------------------------------------
    for (let radiusKm = INITIAL_RADIUS_KM; radiusKm <= MAX_RADIUS_KM; radiusKm += RADIUS_STEP_KM) {
        const nearbyDrivers = driversWithDistance.filter((driver) => driver.distanceKm <=
            radiusKm);
        if (nearbyDrivers.length > 0) {
            return nearbyDrivers.sort((a, b) => a.distanceKm -
                b.distanceKm);
        }
    }
    // ----------------------------------------------------------
    // NO DRIVER FOUND
    // ----------------------------------------------------------
    return [];
};
