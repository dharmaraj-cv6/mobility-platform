import {
  CarFront,
  ChevronDown,
  MapPin,
  Navigation,
  CircleDot,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";


const CITY_RIDES = [
  {
    id: 1,
    rider: "Priya Nair",
    pickup: "Gandhipuram, Coimbatore",
    drop: "Saravanampatti, Coimbatore",
    distance: "1.2 km",
    status: "OPEN",
  },
  {
    id: 2,
    rider: "Vikram R",
    pickup: "Ukkadam, Coimbatore",
    drop: "Singanallur, Coimbatore",
    distance: "2.8 km",
    status: "OPEN",
  },
  {
    id: 3,
    rider: "Anjali Patel",
    pickup: "Tatabad, Coimbatore",
    drop: "Peelamedu, Coimbatore",
    distance: "3.6 km",
    status: "OPEN",
  },
];

const MY_RIDE_REQUESTS = [
  {
    id: 101,
    rider: "Ravi Kumar",
    pickup: "Gandhipuram, Coimbatore",
    drop: "Peelamedu, Coimbatore",
    fare: 278,
    eta: "6 min",
    distance: "1.4 km",
  },
];

export default function DriverRideManagement({
  incomingRequest = null,
  activeRide = null,
  vehicleImage = null,
}) {
  const hasIncomingRequest =
    Boolean(incomingRequest);

  const hasActiveRide =
    Boolean(activeRide);

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          TOP RIDE REQUEST / DRIVER WATCHING AREA
      ===================================================== */}

      <RideRequestHeader
        incomingRequest={
          incomingRequest
        }
        hasIncomingRequest={
          hasIncomingRequest
        }
        vehicleImage={
          vehicleImage
        }
      />

      {/* =====================================================
          MAIN RIDE MANAGEMENT AREA
      ===================================================== */}

      <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.55fr)]">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="min-w-0 border-b border-slate-200 lg:border-b-0 lg:border-r">

          {hasActiveRide ? (
            <ActiveRidePanel
              activeRide={
                activeRide
              }
            />
          ) : (
            <RideLists
              incomingRequest={
                incomingRequest
              }
            />
          )}

        </div>

        {/* =================================================
            RIGHT SIDE MAP
        ================================================= */}

        <RideMapPanel
          incomingRequest={
            incomingRequest
          }
          activeRide={
            activeRide
          }
        />

      </div>

      {/* =====================================================
          ACTIVE RIDE STATUS BAR
      ===================================================== */}

      {hasActiveRide && (
        <ActiveRideStatusBar
          status={
            activeRide.status
          }
        />
      )}

    </section>
  );
}


// =========================================================
// TOP HEADER
// =========================================================

function RideRequestHeader({
  incomingRequest,
  hasIncomingRequest,
  vehicleImage,
}) {
  if (hasIncomingRequest) {
    return (
      <div className="border-b border-slate-200 bg-white p-5 sm:p-6">

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                New Ride Request
              </p>

            </div>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {incomingRequest.rider}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              New booking request assigned
              to you.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            <RequestStat
              label="Pickup"
              value={
                incomingRequest.pickup
              }
            />

            <RequestStat
              label="Drop"
              value={
                incomingRequest.drop
              }
            />

            <RequestStat
              label="Fare"
              value={`₹${incomingRequest.fare}`}
            />

            <RequestStat
              label="Distance"
              value={
                incomingRequest.distance
              }
            />

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="border-b border-slate-200 bg-white p-5 sm:p-6">

      <div className="flex min-h-[120px] items-center justify-between gap-6">

        {/* VEHICLE */}

        <div className="flex min-w-0 items-center gap-4">

          <div className="relative flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">

            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt="Your vehicle"
                className="h-full w-full object-contain"
              />
            ) : (
              <CarFront
                size={46}
                strokeWidth={1.5}
                className="text-slate-400"
              />
            )}

          </div>

          <div className="min-w-0">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Driver Ride Watch
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              We're watching for new rides
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your vehicle is ready for the
              next ride request.
            </p>

          </div>

        </div>

        {/* STATUS */}

        <div className="hidden shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 sm:flex">

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

          Watching

        </div>

      </div>

    </div>
  );
}


// =========================================================
// REQUEST STAT
// =========================================================

function RequestStat({
  label,
  value,
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 px-3 py-2">

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}


// =========================================================
// RIDE LISTS
// =========================================================

function RideLists({
  incomingRequest,
}) {
  const [activeMenu, setActiveMenu] =
  useState("MY_RIDES");

  const myRequests =
    incomingRequest
      ? [incomingRequest]
      : MY_RIDE_REQUESTS;

  return (
    <div className="flex h-full min-w-0 flex-col">

      {/* MENU */}

      <div className="border-b border-slate-200 px-5 pt-4">

        <div className="flex items-center gap-6">

          <button
            type="button"
            onClick={() =>
              setActiveMenu(
                "CITY_RIDES"
              )
            }
            className={`relative pb-3 text-xs font-semibold transition ${
              activeMenu ===
              "CITY_RIDES"
                ? "text-slate-900"
                : "text-slate-400"
            }`}
          >
            City Rides

            <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px]">
              {CITY_RIDES.length}
            </span>

            {activeMenu ===
              "CITY_RIDES" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-900" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveMenu(
                "MY_RIDES"
              )
            }
            className={`relative pb-3 text-xs font-semibold transition ${
              activeMenu ===
              "MY_RIDES"
                ? "text-slate-900"
                : "text-slate-400"
            }`}
          >
            My Rides

            {myRequests.length >
              0 && (
              <span className="ml-1.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-600">
                {myRequests.length}
              </span>
            )}

            {activeMenu ===
              "MY_RIDES" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-900" />
            )}
          </button>

        </div>

      </div>

      {/* CONTENT */}

      <div className="flex-1 overflow-y-auto p-4">

        {activeMenu ===
        "CITY_RIDES" ? (
          <CityRides />
        ) : (
          <MyRides
            rides={
              myRequests
            }
          />
        )}

      </div>

    </div>
  );
}


// =========================================================
// CITY RIDES
// =========================================================

function CityRides() {
  return (
    <div className="space-y-2">

      <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2">

        <p className="text-xs font-semibold text-slate-700">
          Live City Activity
        </p>

        <p className="mt-0.5 text-[11px] text-slate-400">
          Nearby ride activity in the city.
          These rides are not assigned to you.
        </p>

      </div>

      {CITY_RIDES.map(
        (ride) => (
          <CityRideItem
            key={ride.id}
            ride={ride}
          />
        )
      )}

    </div>
  );
}


// =========================================================
// CITY RIDE ITEM
// NO ACCEPT BUTTON
// =========================================================

function CityRideItem({
  ride,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">

          <UserRound
            size={15}
            className="text-slate-500"
          />

        </div>

        <div className="min-w-0 flex-1">

          <p className="truncate text-xs font-semibold text-slate-800">
            {ride.rider}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {ride.pickup}
          </p>

        </div>

        <div className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[9px] font-medium text-slate-500">
          {ride.distance}
        </div>

      </div>

      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">

        <MapPin
          size={11}
          className="text-emerald-500"
        />

        <span className="truncate">
          {ride.pickup}
        </span>

        <span>→</span>

        <span className="truncate">
          {ride.drop}
        </span>

      </div>

    </div>
  );
}


// =========================================================
// MY RIDES
// =========================================================

function MyRides({
  rides,
}) {
  if (!rides.length) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center text-center">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">

          <CarFront
            size={21}
            className="text-slate-400"
          />

        </div>

        <p className="mt-3 text-sm font-semibold text-slate-700">
          No ride requests
        </p>

        <p className="mt-1 max-w-[220px] text-xs text-slate-400">
          Ride requests assigned to you
          will appear here.
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-2">

      {rides.map(
        (ride) => (
          <MyRideItem
            key={ride.id}
            ride={ride}
          />
        )
      )}

    </div>
  );
}


// =========================================================
// MY RIDE ITEM
// =========================================================

function MyRideItem({
  ride,
}) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">

          <UserRound
            size={16}
            className="text-slate-500"
          />

        </div>

        <div className="min-w-0 flex-1">

          <p className="truncate text-xs font-semibold text-slate-800">
            {ride.rider}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {ride.pickup}
          </p>

        </div>

        <div className="text-right">

          <p className="text-sm font-bold text-slate-900">
            ₹{ride.fare}
          </p>

          <p className="text-[10px] text-slate-400">
            {ride.eta}
          </p>

        </div>

      </div>

      <div className="mt-3 flex items-center justify-between">

        <div className="min-w-0 text-[10px] text-slate-400">

          <span className="font-medium text-emerald-600">
            Pickup
          </span>

          {" → "}

          {ride.drop}

        </div>

        <button
          type="button"
          className="ml-3 shrink-0 rounded-lg bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-emerald-600"
        >
          Accept
        </button>

      </div>

    </div>
  );
}


// =========================================================
// ACTIVE RIDE
// =========================================================

function ActiveRidePanel({
  activeRide,
}) {
  return (
    <div className="h-full p-5">

      <div className="flex items-center gap-2">

        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Active Ride
        </p>

      </div>

      <div className="mt-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">

            <UserRound
              size={18}
              className="text-slate-600"
            />

          </div>

          <div>

            <p className="text-sm font-bold text-slate-900">
              {activeRide.rider}
            </p>

            <p className="text-xs text-slate-400">
              Active booking
            </p>

          </div>

        </div>

      </div>

      <div className="mt-6 space-y-4">

        <LocationRow
          type="pickup"
          label="Pickup"
          value={
            activeRide.pickup
          }
        />

        <LocationRow
          type="drop"
          label="Drop"
          value={
            activeRide.drop
          }
        />

      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Fare
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              ₹{activeRide.fare}
            </p>

          </div>

          <div className="text-right">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Status
            </p>

            <p className="mt-1 text-xs font-bold text-blue-600">
              {formatRideStatus(
                activeRide.status
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


// =========================================================
// LOCATION ROW
// =========================================================

function LocationRow({
  type,
  label,
  value,
}) {
  const isPickup =
    type === "pickup";

  return (
    <div className="flex gap-3">

      <div className="flex flex-col items-center">

        {isPickup ? (
          <CircleDot
            size={16}
            className="text-emerald-500"
          />
        ) : (
          <MapPin
            size={16}
            className="text-red-500"
          />
        )}

        <span className="mt-1 h-8 w-px bg-slate-200" />

      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}


// =========================================================
// MAP
// =========================================================

function RideMapPanel({
  incomingRequest,
  activeRide,
}) {
  const hasRide =
    Boolean(
      incomingRequest ||
        activeRide
    );

  return (
    <div className="relative min-h-[420px] overflow-hidden bg-slate-100">

      {/* MAP BACKGROUND */}

      <div className="absolute inset-0">

        <div className="absolute left-[15%] top-[20%] h-px w-[75%] rotate-[12deg] bg-white" />

        <div className="absolute left-[5%] top-[55%] h-px w-[90%] rotate-[-8deg] bg-white" />

        <div className="absolute left-[30%] top-0 h-full w-px rotate-[15deg] bg-white" />

        <div className="absolute left-[65%] top-0 h-full w-px rotate-[-12deg] bg-white" />

        <div className="absolute left-[45%] top-[30%] h-40 w-40 rounded-full bg-blue-200/30 blur-sm" />

      </div>

      {/* MAP LABELS */}

      <span className="absolute left-[24%] top-[28%] text-xs font-medium text-slate-500">
        Gandhipuram
      </span>

      <span className="absolute right-[15%] top-[42%] text-xs font-medium text-slate-500">
        Peelamedu
      </span>

      <span className="absolute left-[18%] bottom-[22%] text-xs font-medium text-slate-500">
        Ukkadam
      </span>

      <span className="absolute right-[20%] bottom-[18%] text-xs font-medium text-slate-500">
        Singanallur
      </span>

      {/* DRIVER LOCATION */}

      <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-lg">

        <CarFront
          size={21}
          className="text-white"
        />

      </div>

      {/* RIDE MARKERS */}

      {hasRide && (
        <>
          <MapMarker
            type="pickup"
            className="left-[27%] top-[35%]"
          />

          <MapMarker
            type="drop"
            className="right-[22%] top-[48%]"
          />
        </>
      )}

      {/* TOP MAP STATUS */}

      <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">

        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />

        {activeRide
          ? "Active Ride"
          : incomingRequest
          ? "New Request"
          : "Live City Map"}

      </div>

    </div>
  );
}


// =========================================================
// MAP MARKER
// =========================================================

function MapMarker({
  type,
  className,
}) {
  const isPickup =
    type === "pickup";

  return (
    <div
      className={`absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-md ${
        isPickup
          ? "bg-emerald-500"
          : "bg-red-500"
      } ${className}`}
    >
      {isPickup ? (
        <Navigation
          size={15}
          className="text-white"
        />
      ) : (
        <MapPin
          size={15}
          className="text-white"
        />
      )}
    </div>
  );
}


// =========================================================
// ACTIVE RIDE STATUS BAR
// =========================================================

function ActiveRideStatusBar({
  status,
}) {
  const steps = [
    {
      key: "START_PICKUP",
      label: "Start Pickup",
    },
    {
      key: "ON_GOING",
      label: "On Going",
    },
    {
      key: "DROP",
      label: "Drop",
    },
  ];

  const currentIndex =
    steps.findIndex(
      (step) =>
        step.key === status
    );

  return (
    <div className="border-t border-slate-200 bg-white px-5 py-4">

      <div className="flex items-center justify-between gap-3">

        {steps.map(
          (step, index) => {

            const completed =
              index <
              currentIndex;

            const current =
              index ===
              currentIndex;

            return (
              <div
                key={step.key}
                className="flex min-w-0 flex-1 items-center"
              >

                <div className="flex min-w-0 items-center gap-2">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      current
                        ? "bg-blue-600 text-white"
                        : completed
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2
                        size={16}
                      />
                    ) : current ? (
                      <CarFront
                        size={17}
                      />
                    ) : (
                      <Clock3
                        size={16}
                      />
                    )}
                  </div>

                  <p
                    className={`hidden truncate text-xs font-semibold sm:block ${
                      current
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>

                </div>

                {index <
                  steps.length -
                    1 && (
                  <div className="mx-2 h-px flex-1 bg-slate-200" />
                )}

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


// =========================================================
// HELPERS
// =========================================================

function formatRideStatus(
  status
) {
  switch (status) {
    case "START_PICKUP":
      return "Pickup";

    case "ON_GOING":
      return "On Going";

    case "DROP":
      return "Drop";

    default:
      return "Active";
  }
}