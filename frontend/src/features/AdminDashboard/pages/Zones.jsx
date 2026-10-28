import {
  useMemo,
  useState,
} from "react";

import {
  MapPinned,
  Users,
  UserCheck,
  Car,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

// =====================================================
// BASE ZONE DATA
// =====================================================

const BASE_ZONES = [
  {
    id: "zone-1",
    name: "Zone 1",
    location: "Coimbatore Central",

    riders: 1240,
    drivers: 186,

    activeDrivers: 142,

    totalTrips: 8420,

    topDriver: {
      name: "Driver 01",
      trips: 286,
    },

    averageFare: 185,

    fareRange: {
      min: 120,
      max: 320,
    },
  },

  {
    id: "zone-2",
    name: "Zone 2",
    location: "Coimbatore North",

    riders: 980,
    drivers: 142,

    activeDrivers: 108,

    totalTrips: 6240,

    topDriver: {
      name: "Driver 02",
      trips: 241,
    },

    averageFare: 210,

    fareRange: {
      min: 140,
      max: 360,
    },
  },

  {
    id: "zone-3",
    name: "Zone 3",
    location: "Coimbatore South",

    riders: 860,
    drivers: 118,

    activeDrivers: 94,

    totalTrips: 5180,

    topDriver: {
      name: "Driver 03",
      trips: 198,
    },

    averageFare: 195,

    fareRange: {
      min: 130,
      max: 340,
    },
  },
];

// =====================================================
// PAGE
// =====================================================

export default function Zones() {
  const [
    zones,
    setZones,
  ] = useState(
    BASE_ZONES
  );

  const [
    activeZone,
    setActiveZone,
  ] = useState(
    "zone-1"
  );

  const selectedZone =
    useMemo(
      () =>
        zones.find(
          (zone) =>
            zone.id ===
            activeZone
        ) ||
        zones[0],
      [
        zones,
        activeZone,
      ]
    );

  const totalRiders =
    zones.reduce(
      (sum, zone) =>
        sum +
        zone.riders,
      0
    );

  const totalDrivers =
    zones.reduce(
      (sum, zone) =>
        sum +
        zone.drivers,
      0
    );

  const totalTrips =
    zones.reduce(
      (sum, zone) =>
        sum +
        zone.totalTrips,
      0
    );

  const averageFare =
    zones.length
      ? Math.round(
          zones.reduce(
            (
              sum,
              zone
            ) =>
              sum +
              zone.averageFare,
            0
          ) /
            zones.length
        )
      : 0;

  return (
    <main className="w-full">

      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* HEADER */}

        <section>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ADMIN / ZONES
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Zones
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage riders, drivers, trips and market fares by operating zone.
          </p>

        </section>

        {/* SUMMARY */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Summary
            icon={MapPinned}
            label="Zones"
            value={
              zones.length
            }
          />

          <Summary
            icon={Users}
            label="Total Riders"
            value={totalRiders}
          />

          <Summary
            icon={UserCheck}
            label="Total Drivers"
            value={totalDrivers}
          />

          <Summary
            icon={TrendingUp}
            label="Total Trips"
            value={totalTrips}
          />

        </section>

        {/* ZONE SELECTOR */}

        <section className="grid gap-4 lg:grid-cols-3">

          {zones.map(
            (zone) => {

              const active =
                zone.id ===
                activeZone;

              return (
                <button
                  key={
                    zone.id
                  }
                  type="button"
                  onClick={() =>
                    setActiveZone(
                      zone.id
                    )
                  }
                  className={[
                    "rounded-2xl border p-5 text-left transition",
                    active
                      ? "border-slate-900 bg-slate-900 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300",
                  ].join(" ")}
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          active
                            ? "text-slate-300"
                            : "text-slate-400"
                        }`}
                      >
                        Operating Zone
                      </p>

                      <h2 className="mt-1 text-lg font-bold">
                        {zone.name}
                      </h2>

                      <p
                        className={`mt-1 text-sm ${
                          active
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        {zone.location}
                      </p>

                    </div>

                    <MapPinned
                      size={20}
                    />

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <MiniStat
                      label="Riders"
                      value={
                        zone.riders
                      }
                      active={
                        active
                      }
                    />

                    <MiniStat
                      label="Drivers"
                      value={
                        zone.drivers
                      }
                      active={
                        active
                      }
                    />

                  </div>

                </button>
              );
            }
          )}

        </section>

        {/* SELECTED ZONE */}

        {selectedZone && (

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  SELECTED ZONE
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedZone.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedZone.location}
                </p>

              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Active Zone
              </span>

            </div>

            {/* METRICS */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <Metric
                icon={Users}
                label="Riders"
                value={
                  selectedZone.riders
                }
              />

              <Metric
                icon={UserCheck}
                label="Drivers"
                value={
                  selectedZone.drivers
                }
              />

              <Metric
                icon={Car}
                label="Active Drivers"
                value={
                  selectedZone.activeDrivers
                }
              />

              <Metric
                icon={TrendingUp}
                label="Total Trips"
                value={
                  selectedZone.totalTrips
                }
              />

            </div>

            {/* MARKET */}

            <div className="mt-6 grid gap-4 lg:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                    <IndianRupee
                      size={18}
                    />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Market Fare
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      ₹
                      {
                        selectedZone.averageFare
                      }
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Market range
                  </span>

                  <span className="font-semibold text-slate-800">
                    ₹
                    {
                      selectedZone.fareRange
                        .min
                    }
                    {" – "}
                    ₹
                    {
                      selectedZone.fareRange
                        .max
                    }
                  </span>

                </div>

              </div>

              {/* TOP DRIVER */}

              <div className="rounded-2xl border border-slate-200 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                    <UserCheck
                      size={18}
                    />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Top Ride Driver
                    </p>

                    <p className="mt-1 text-base font-bold text-slate-900">
                      {
                        selectedZone
                          .topDriver
                          .name
                      }
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Completed trips
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    {
                      selectedZone
                        .topDriver
                        .trips
                    }
                  </span>

                </div>

              </div>

            </div>

          </section>
        )}

      </div>

    </main>
  );
}

// =====================================================
// SUMMARY
// =====================================================

function Summary({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

          <Icon
            size={18}
            className="text-slate-700"
          />

        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value.toLocaleString()}
        </span>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

    </div>
  );
}

// =====================================================
// MINI
// =====================================================

function MiniStat({
  label,
  value,
  active,
}) {
  return (
    <div>

      <p
        className={`text-xs ${
          active
            ? "text-slate-300"
            : "text-slate-400"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value.toLocaleString()}
      </p>

    </div>
  );
}

// =====================================================
// METRIC
// =====================================================

function Metric({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center justify-between">

        <Icon
          size={18}
          className="text-slate-500"
        />

        <span className="text-xl font-bold text-slate-900">
          {value.toLocaleString()}
        </span>

      </div>

      <p className="mt-3 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}