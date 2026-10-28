import prisma from "../../config/prisma.js";
// ============================================================
// GET ALL ONLINE DRIVERS
//
// Returns:
// - every currently online driver
// - current location
// - active vehicle
// - driver's matching service
// - driver's REAL configured fare
//
// Passenger selected serviceType is used only to select
// the correct DriverService / fare.
//
// No frontend driverId is trusted.
// ============================================================
export const getAvailableDriversRepository = async (pickupLatitude, pickupLongitude, serviceType) => {
    // ==========================================================
    // NORMALIZE SERVICE
    // ==========================================================
    const normalizedServiceType = serviceType
        ?.trim()
        .toUpperCase();
    // ==========================================================
    // GET ALL ONLINE DRIVERS
    // ==========================================================
    const drivers = await prisma.driverProfile.findMany({
        where: {
            availability: {
                isOnline: true,
                currentLatitude: {
                    not: null,
                },
                currentLongitude: {
                    not: null,
                },
            },
            // If passenger selected a service,
            // driver must have that service.
            ...(normalizedServiceType
                ? {
                    services: {
                        some: {
                            serviceType: normalizedServiceType,
                        },
                    },
                }
                : {}),
        },
        include: {
            // ====================================================
            // AVAILABILITY
            // ====================================================
            availability: true,
            // ====================================================
            // DRIVER ACCOUNT
            // ====================================================
            user: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
            // ====================================================
            // ACTIVE / DEFAULT VEHICLE
            // ====================================================
            Vehicle: {
                where: {
                    isActive: true,
                },
                orderBy: [
                    {
                        isDefault: "desc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
                take: 1,
                include: {
                    documents: true,
                },
            },
            // ====================================================
            // ALL DRIVER SERVICES
            // ====================================================
            services: {
                orderBy: {
                    updatedAt: "desc",
                },
            },
        },
        orderBy: {
            id: "desc",
        },
    });
    // ==========================================================
    // DISTANCE
    // ==========================================================
    const toRadians = (value) => {
        return ((value * Math.PI) /
            180);
    };
    const calculateDistanceKm = (latitude1, longitude1, latitude2, longitude2) => {
        const earthRadiusKm = 6371;
        const dLatitude = toRadians(latitude2 -
            latitude1);
        const dLongitude = toRadians(longitude2 -
            longitude1);
        const a = Math.sin(dLatitude / 2) *
            Math.sin(dLatitude / 2) +
            Math.cos(toRadians(latitude1)) *
                Math.cos(toRadians(latitude2)) *
                Math.sin(dLongitude / 2) *
                Math.sin(dLongitude / 2);
        const c = 2 *
            Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (earthRadiusKm * c);
    };
    // ==========================================================
    // BUILD DRIVER RESPONSE
    // ==========================================================
    return drivers
        .map((driver) => {
        // ------------------------------------------------------
        // DRIVER LOCATION
        // ------------------------------------------------------
        const latitude = driver.availability
            ?.currentLatitude;
        const longitude = driver.availability
            ?.currentLongitude;
        const distanceKm = latitude !== null &&
            latitude !== undefined &&
            longitude !== null &&
            longitude !== undefined
            ? calculateDistanceKm(pickupLatitude, pickupLongitude, latitude, longitude)
            : null;
        // ------------------------------------------------------
        // IMPORTANT
        //
        // Find the driver's ACTUAL selected service.
        //
        // Do NOT use driver.services[0].
        // ------------------------------------------------------
        const matchedService = normalizedServiceType
            ? driver.services.find((service) => String(service.serviceType)
                .trim()
                .toUpperCase() ===
                normalizedServiceType)
            : driver.services[0];
        // ------------------------------------------------------
        // DRIVER FARE
        //
        // The fare belongs to DriverService.fare.
        // ------------------------------------------------------
        const fare = matchedService?.fare ??
            null;
        // ------------------------------------------------------
        // EXTRACT DAY FARE
        // ------------------------------------------------------
        const fareObject = fare &&
            typeof fare ===
                "object"
            ? fare
            : null;
        const dayFare = fareObject?.dayFare ??
            null;
        const minimumFare = dayFare?.minimumFare != null
            ? Number(dayFare.minimumFare)
            : null;
        const perKm = dayFare?.perKm != null
            ? Number(dayFare.perKm)
            : null;
        // ------------------------------------------------------
        // RETURN DRIVER
        // ------------------------------------------------------
        return {
            // Driver identity
            driverId: driver.id,
            driverProfileId: driver.id,
            user: driver.user,
            // Driver availability
            availability: driver.availability,
            // Vehicle
            vehicle: driver.Vehicle[0] ??
                null,
            // ====================================================
            // REAL MATCHED DRIVER SERVICE
            // ====================================================
            service: matchedService ??
                null,
            // Keep all services available
            services: driver.services,
            // ====================================================
            // REAL DRIVER FARE
            //
            // These fields make frontend display reliable.
            // ====================================================
            fare,
            minimumFare: Number.isFinite(minimumFare)
                ? minimumFare
                : null,
            perKm: Number.isFinite(perKm)
                ? perKm
                : null,
            // Distance from passenger pickup
            distanceKm: distanceKm === null
                ? null
                : Number(distanceKm.toFixed(2)),
        };
    })
        // ========================================================
        // NEAREST FIRST
        // ========================================================
        .sort((a, b) => {
        if (a.distanceKm === null) {
            return 1;
        }
        if (b.distanceKm === null) {
            return -1;
        }
        return (a.distanceKm -
            b.distanceKm);
    });
};
