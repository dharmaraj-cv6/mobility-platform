import prisma from "../../config/prisma.js";
// ============================================================
// WATCHER REPOSITORY
// ============================================================
//
// Watchers are created ONLY from the driver's list already
// displayed to the passenger.
//
// This repository does NOT:
// - search GPS
// - calculate distance
// - call a map API
// - expand radius
// - search additional drivers
//
// One passenger + one driver = one watcher relationship.
//
// Database uniqueness:
// passengerId + driverProfileId
// ============================================================
const WATCHER_DURATION_MINUTES = 5;
// ============================================================
// START WATCHERS
// ============================================================
export const startWatchers = async (passengerId, driverProfileIds) => {
    const uniqueDriverProfileIds = [
        ...new Set(driverProfileIds
            .map(Number)
            .filter((id) => Number.isInteger(id) &&
            id > 0)),
    ];
    if (uniqueDriverProfileIds.length === 0) {
        return [];
    }
    // ----------------------------------------------------------
    // Validate only supplied driver IDs.
    // ----------------------------------------------------------
    const drivers = await prisma.driverProfile.findMany({
        where: {
            id: {
                in: uniqueDriverProfileIds,
            },
        },
        select: {
            id: true,
        },
    });
    const validDriverProfileIds = new Set(drivers.map((driver) => driver.id));
    const now = new Date();
    const expiresAt = new Date(now.getTime() +
        WATCHER_DURATION_MINUTES *
            60 *
            1000);
    const validIds = uniqueDriverProfileIds.filter((driverProfileId) => validDriverProfileIds.has(driverProfileId));
    if (validIds.length === 0) {
        return [];
    }
    // ----------------------------------------------------------
    // UPSERT
    // ----------------------------------------------------------
    //
    // Existing passenger + driver:
    // refresh expiry.
    //
    // New passenger + driver:
    // create relationship.
    //
    // IMPORTANT:
    // We do NOT create duplicate rows.
    // ----------------------------------------------------------
    await prisma.$transaction(validIds.map((driverProfileId) => prisma.watcherSession.upsert({
        where: {
            passengerId_driverProfileId: {
                passengerId,
                driverProfileId,
            },
        },
        create: {
            passengerId,
            driverProfileId,
            serviceType: "ALL",
            bookingId: null,
            expiresAt,
        },
        update: {
            expiresAt,
            serviceType: "ALL",
            bookingId: null,
        },
    })));
    // ----------------------------------------------------------
    // Return active sessions.
    // ----------------------------------------------------------
    return prisma.watcherSession.findMany({
        where: {
            passengerId,
            driverProfileId: {
                in: validIds,
            },
            expiresAt: {
                gt: new Date(),
            },
        },
        select: {
            id: true,
            sessionId: true,
            driverProfileId: true,
            expiresAt: true,
        },
    });
};
// ============================================================
// STOP WATCHERS
// ============================================================
//
// Stops only this passenger's watcher relationships.
//
// IMPORTANT:
// driverProfileIds are used, NOT sessionIds.
// ============================================================
export const stopWatchers = async (passengerId, driverProfileIds) => {
    // Explicit empty array = nothing to stop.
    if (Array.isArray(driverProfileIds) &&
        driverProfileIds.length === 0) {
        return;
    }
    const uniqueDriverProfileIds = driverProfileIds
        ? [
            ...new Set(driverProfileIds
                .map(Number)
                .filter((id) => Number.isInteger(id) &&
                id > 0)),
        ]
        : undefined;
    if (driverProfileIds !== undefined &&
        uniqueDriverProfileIds?.length === 0) {
        return;
    }
    const now = new Date();
    await prisma.watcherSession.updateMany({
        where: {
            passengerId,
            ...(uniqueDriverProfileIds
                ? {
                    driverProfileId: {
                        in: uniqueDriverProfileIds,
                    },
                }
                : {}),
            expiresAt: {
                gt: now,
            },
        },
        data: {
            expiresAt: now,
        },
    });
};
// ============================================================
// SINGLE DRIVER COUNT
// ============================================================
export const getDriverWatcherCount = async (driverProfileId) => {
    return prisma.watcherSession.count({
        where: {
            driverProfileId,
            expiresAt: {
                gt: new Date(),
            },
        },
    });
};
// ============================================================
// MULTIPLE DRIVER COUNTS
// ============================================================
export const getDriverWatcherCounts = async (driverProfileIds) => {
    const uniqueIds = [
        ...new Set(driverProfileIds
            .map(Number)
            .filter((id) => Number.isInteger(id) &&
            id > 0)),
    ];
    if (uniqueIds.length === 0) {
        return [];
    }
    const rows = await prisma.watcherSession.groupBy({
        by: [
            "driverProfileId",
        ],
        where: {
            driverProfileId: {
                in: uniqueIds,
            },
            expiresAt: {
                gt: new Date(),
            },
        },
        _count: {
            _all: true,
        },
    });
    return rows.map((row) => ({
        driverProfileId: row.driverProfileId,
        watcherCount: row._count._all,
    }));
};
