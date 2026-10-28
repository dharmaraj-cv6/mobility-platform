import { useState } from "react";

export function WatcherAlert({ watcherCount, serviceType }) {
  if (!watcherCount || watcherCount <= 0) {
    return null;
  }

  return (
    <div className="flex min-h-[92px] items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-blue-900">
          Someone is watching
        </p>

        <p className="mt-1 truncate text-xs text-blue-700">
          {serviceType || "Active ride service"}
        </p>
      </div>

      <div className="ml-4 shrink-0 text-center">
        <p className="text-3xl font-bold leading-none text-blue-700">
          {watcherCount}
        </p>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
          Watching
        </p>
      </div>
    </div>
  );
}

// =====================================================
// NEARBY RIDER SECTION
// =====================================================

export function NearbyRiderSection({
  riders,
  requests,
  loading,
  isVerified,
  isOnline,
  acceptingId,
  onAccept,
  onReject,
  rejectedCount,
  watcherCount,
  watcherServiceType,
  activeBookings,
  completedBookings,
  activeRide,
  onStartRide,
  onEmergencyCancel,
  emergencyCancelCount,
}) {
  const liveRequests =
    isVerified && isOnline && !activeRide
      ? Array.isArray(requests)
        ? requests
        : []
      : [];

  const watching = Number(watcherCount) || 0;
  const hasNewBooking = liveRequests.length > 0;

  const statusLabel = hasNewBooking
    ? "New Booking"
    : "Watching";

  const statusCount = hasNewBooking
    ? liveRequests.length
    : watching;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

      {/* HEADER */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              New Ride Requests Near You
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Riders within 3–5 km from your current location
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            {statusLabel}
          </div>
        </div>
      </div>

      {/* LIVE COUNT */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex min-h-[124px] items-center justify-center rounded-2xl bg-slate-50">
            <p className="text-xs font-medium text-slate-500">
              Loading...
            </p>
          </div>
        ) : hasNewBooking ? (
          <RideRequestSection
            requests={liveRequests}
            loading={false}
            acceptingId={acceptingId}
            onAccept={onAccept}
            onReject={onReject}
            rejectedCount={rejectedCount}
          />
        ) : (
          <div className="flex min-h-[124px] flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
            <p className="text-3xl font-bold leading-none text-slate-700">
              {statusCount}
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              {statusLabel}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {statusLabel === "Watching"
                ? watcherServiceType
                  ? `${watcherServiceType} passenger demand is watching you.`
                  : "Passenger demand currently watching you."
                : "New booking requests will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* BOOKINGS + MAP */}
      <div className="grid border-t border-slate-100 lg:grid-cols-[0.95fr_1.55fr]">

        <div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r">
          <DriverBookingLists
            activeBookings={activeBookings}
            completedBookings={completedBookings}
          />
        </div>

        <NearbyRiderMap
          riders={
            Array.isArray(riders)
              ? riders.slice(0, 3)
              : []
          }
          isVerified={isVerified}
          isOnline={isOnline}
          activeRide={activeRide}
          onStartRide={onStartRide}
          onEmergencyCancel={onEmergencyCancel}
          emergencyCancelCount={emergencyCancelCount}
        />
      </div>

      {!isVerified && (
        <div className="border-t border-amber-100 bg-amber-50 px-5 py-3">
          <p className="text-xs font-medium text-amber-700">
            Nearby rider demand is visible for information only.
            Ride requests and accepting rides become available
            after admin approval.
          </p>
        </div>
      )}
    </div>
  );
}

// =====================================================
// NEARBY RIDER CARD
// =====================================================

export function NearbyRiderCard({ rider, index }) {
  const distance =
    rider?.distance ??
    rider?.distanceKm ??
    [3.2, 4.1, 4.8][index] ??
    0;

  const pickup =
    rider?.pickupLocation ||
    rider?.pickup ||
    rider?.from ||
    rider?.pickupAddress ||
    "Nearby location";

  const destination =
    rider?.dropLocation ||
    rider?.destination ||
    rider?.to ||
    rider?.dropoffAddress ||
    "Destination";

  const fare =
    rider?.estimatedFare ??
    rider?.fare ??
    [245, 310, 520][index] ??
    0;

  const service =
    rider?.serviceType ||
    rider?.rideType ||
    ["Economy", "Economy", "Premium"][index];

  const ridersCount =
    rider?.riders ??
    rider?.passengerCount ??
    1;

  const luggage =
    rider?.luggage ??
    rider?.bags ??
    "No Luggage";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          {Number(distance).toFixed(1)} km away
        </span>

        <span className="text-xs text-slate-400">
          New
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg">
          👤
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-slate-700" />

            <p className="truncate text-sm font-semibold text-slate-800">
              {pickup}
            </p>
          </div>

          <div className="ml-[3px] h-3 border-l border-dashed border-slate-300" />

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />

            <p className="truncate text-sm font-semibold text-slate-800">
              {destination}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">
            ₹{fare}
          </p>

          <p className="text-xs font-semibold text-amber-600">
            {service}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>
            👤 {ridersCount}{" "}
            {ridersCount === 1 ? "Rider" : "Riders"}
          </span>

          <span className="h-4 border-l border-slate-200" />

          <span>
            🧳 {luggage}
          </span>
        </div>

        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400">
          Demand
        </span>
      </div>
    </div>
  );
}

// =====================================================
// MAP
// =====================================================

export function NearbyRiderMap({
  riders,
  isVerified,
  isOnline,
  activeRide,
  onStartRide,
  onEmergencyCancel,
  emergencyCancelCount,
}) {
  return (
    <div className="relative min-h-[420px] overflow-hidden bg-slate-100">

      <div className="absolute right-4 top-4 z-30">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-lg backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {riders.length} Nearby
        </div>
      </div>

      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[8%] top-[15%] h-px w-[80%] rotate-[12deg] bg-white" />
        <div className="absolute left-[5%] top-[35%] h-px w-[90%] -rotate-[7deg] bg-white" />
        <div className="absolute left-[12%] top-[58%] h-px w-[80%] rotate-[4deg] bg-white" />
        <div className="absolute left-[35%] top-[-10%] h-[120%] w-px rotate-[18deg] bg-white" />
        <div className="absolute left-[65%] top-[-10%] h-[120%] w-px -rotate-[14deg] bg-white" />
        <div className="absolute left-[47%] top-[30%] h-32 w-32 rounded-full border border-blue-100 bg-blue-100/50" />
      </div>

      <span className="absolute left-[25%] top-[35%] text-xs font-medium text-slate-500">
        Peelamedu
      </span>

      <span className="absolute right-[25%] top-[35%] text-xs font-medium text-slate-500">
        Gandhipuram
      </span>

      <span className="absolute left-[30%] bottom-[25%] text-xs font-medium text-slate-500">
        RS Puram
      </span>

      <span className="absolute right-[18%] bottom-[18%] text-xs font-medium text-slate-500">
        Airport
      </span>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-blue-500 text-xl shadow-lg">
          🚕
        </div>

        <div className="mt-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow">
          You
        </div>
      </div>

      {riders.slice(0, 3).map((rider, index) => {
        const positions = [
          "left-[22%] top-[27%]",
          "right-[24%] top-[25%]",
          "left-[35%] bottom-[22%]",
        ];

        return (
          <div
            key={
              rider?.id ||
              rider?.userId ||
              index
            }
            className={`absolute ${positions[index]}`}
          >
            <div className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
              {Number(
                rider?.distance ??
                rider?.distanceKm ??
                [3.2, 4.1, 4.8][index]
              ).toFixed(1)}{" "}
              km
            </div>

            <div className="mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-sm shadow">
              👤
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 right-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            🚕
          </span>
          You (Current Location)
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
            👤
          </span>
          New Rider Demand
        </div>
      </div>

      {activeRide && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px]">
          <div className="flex w-full max-w-sm flex-col items-center px-6">
            <button
              type="button"
              onClick={onStartRide}
              className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-base font-bold text-white shadow-2xl transition hover:bg-blue-700"
            >
              START RIDE
            </button>

            <button
              type="button"
              onClick={onEmergencyCancel}
              disabled={emergencyCancelCount >= 2}
              className="mt-3 rounded-xl bg-white/95 px-5 py-3 text-xs font-semibold text-red-600 shadow-lg disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Emergency Cancel (
              {Math.max(
                0,
                2 - emergencyCancelCount
              )}{" "}
              remaining this week)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// REAL RIDE REQUESTS
// =====================================================

export function RideRequestSection({
  requests,
  loading,
  acceptingId,
  onAccept,
  onReject,
  rejectedCount,
}) {
  const safeRequests = Array.isArray(requests)
    ? requests
    : [];

  if (loading) {
    return (
      <div className="flex min-h-[118px] items-center justify-center rounded-2xl bg-slate-50">
        <p className="text-xs font-medium text-slate-500">
          Loading live ride requests...
        </p>
      </div>
    );
  }

  if (safeRequests.length === 0) {
    return (
      <div className="flex min-h-[118px] items-center justify-center rounded-2xl bg-slate-50 px-4 py-5 text-center">
        <div>
          <p className="text-sm font-semibold text-slate-600">
            No new ride requests
          </p>

          <p className="mt-1 text-xs text-slate-400">
            New requests within 5 km will appear automatically.
          </p>

          {rejectedCount > 0 && (
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Rejected: {rejectedCount}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {safeRequests.map((ride) => (
        <LiveRideCard
          key={ride?.id}
          ride={ride}
          accepting={acceptingId === ride?.id}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}

      {rejectedCount > 0 && (
        <p className="text-right text-[11px] font-semibold text-slate-500">
          Rejected: {rejectedCount}
        </p>
      )}
    </div>
  );
}

// =====================================================
// LIVE RIDE CARD
// =====================================================

export function LiveRideCard({
  ride,
  accepting,
  onAccept,
  onReject,
}) {
  const pickup =
    ride?.pickupLocation ||
    ride?.pickup ||
    ride?.from ||
    ride?.pickupAddress ||
    "Pickup";

  const destination =
    ride?.dropLocation ||
    ride?.destination ||
    ride?.to ||
    ride?.dropAddress ||
    "Destination";

  const fare =
    ride?.estimatedFare ??
    ride?.fare ??
    0;

  const distance =
    ride?.distance ??
    ride?.distanceKm ??
    ride?.estimatedDistance ??
    0;

  const awayDistance =
    ride?.awayDistance ??
    ride?.driverDistance ??
    ride?.distanceAway ??
    ride?.distanceFromDriver ??
    distance;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
          {pickup}
        </span>

        <span className="shrink-0 text-slate-400">
          →
        </span>

        <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
          {destination}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px]">
        <span className="font-semibold text-slate-600">
          {Number(distance).toFixed(1)} km
        </span>

        <span className="font-bold text-slate-900">
          ₹{fare}
        </span>

        <span className="font-semibold text-emerald-600">
          {Number(awayDistance).toFixed(1)} km away
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={accepting}
          onClick={() => onReject(ride?.id)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>

        <button
          type="button"
          disabled={accepting}
          onClick={() => onAccept(ride?.id)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {accepting ? "Accepting..." : "Accept"}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// ACTIVE BOOKINGS + COMPLETED
// =====================================================

export function DriverBookingLists({
  activeBookings,
  completedBookings,
}) {
  const [activeTab, setActiveTab] =
    useState("active");

  const active = Array.isArray(activeBookings)
    ? [...activeBookings].sort(
        (a, b) =>
          new Date(
            b?.createdAt ??
            b?.booking?.createdAt ??
            0
          ).getTime() -
          new Date(
            a?.createdAt ??
            a?.booking?.createdAt ??
            0
          ).getTime()
      )
    : [];

  const completed = Array.isArray(
    completedBookings
  )
    ? [...completedBookings].sort(
        (a, b) =>
          new Date(
            b?.completedAt ??
            b?.paymentCompletedAt ??
            b?.updatedAt ??
            0
          ).getTime() -
          new Date(
            a?.completedAt ??
            a?.paymentCompletedAt ??
            a?.updatedAt ??
            0
          ).getTime()
      )
    : [];

  const rideType = (booking) => {
    const value = String(
      booking?.rideType ??
      booking?.booking?.rideType ??
      booking?.entryType ??
      ""
    ).toUpperCase();

    if (value.includes("SHARE")) {
      return "Share Ride";
    }

    if (
      value.includes("SCHEDULE") ||
      value.includes("SCHEDULED")
    ) {
      return "Scheduled";
    }

    return "Book Now";
  };

  const RideListItem = ({
    booking,
    completed: completedItem = false,
  }) => {
    const pickup =
      booking?.pickupAddress ??
      booking?.pickupLocation ??
      booking?.booking?.pickupAddress ??
      "Pickup";

    const drop =
      booking?.dropAddress ??
      booking?.dropLocation ??
      booking?.booking?.dropAddress ??
      "Destination";

    const distance =
      booking?.estimatedDistance ??
      booking?.distance ??
      booking?.booking?.estimatedDistance;

    const fare =
      booking?.estimatedFare ??
      booking?.fare ??
      booking?.booking?.estimatedFare;

    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
            {rideType(booking)}
          </span>

          <span className="text-[10px] font-medium text-slate-400">
            {completedItem
              ? "Completed"
              : "Active"}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
          <span className="truncate font-semibold text-slate-800">
            {pickup}
          </span>

          <span className="text-slate-300">
            →
          </span>

          <span className="truncate text-right font-semibold text-slate-800">
            {drop}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500">
          <span>
            {distance != null
              ? `${Number(distance).toFixed(1)} km`
              : "Distance —"}
          </span>

          <span className="font-bold text-slate-900">
            {fare != null
              ? `₹${fare}`
              : "Fare —"}
          </span>
        </div>
      </div>
    );
  };

  const showing =
    activeTab === "active"
      ? active
      : completed;

  return (
    <div className="w-full">

      {/* SINGLE-LINE TAB MENU */}
      <div className="flex h-11 items-center rounded-full border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex h-full flex-1 items-center justify-center rounded-full px-3 text-xs font-semibold transition ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <span>Active Bookings</span>

          <span
            className={`ml-2 min-w-[22px] rounded-full px-1.5 py-0.5 text-[10px] ${
              activeTab === "active"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {active.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`flex h-full flex-1 items-center justify-center rounded-full px-3 text-xs font-semibold transition ${
            activeTab === "completed"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <span>Completed</span>

          <span
            className={`ml-2 min-w-[22px] rounded-full px-1.5 py-0.5 text-[10px] ${
              activeTab === "completed"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {completed.length}
          </span>
        </button>
      </div>

      <div className="mt-3">
        {showing.length === 0 ? (
          <div className="flex min-h-[104px] items-center justify-center rounded-2xl bg-slate-50 px-4 text-center">
            <p className="text-xs font-medium text-slate-500">
              {activeTab === "active"
                ? "No active bookings"
                : "No completed rides"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {showing.map((booking) => (
              <RideListItem
                key={
                  booking?.id ??
                  booking?.bookingId
                }
                booking={booking}
                completed={
                  activeTab === "completed"
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
