function readCoordinates(value) {
  if (!value || typeof value !== "object") return null;

  const latitude = Number(
    value.latitude ??
      value.lat ??
      value.currentLatitude ??
      value.currentLat ??
      value.gpsLatitude ??
      value.driverLatitude ??
      value.currentLatitude,
  );
  const longitude = Number(
    value.longitude ??
      value.lng ??
      value.lon ??
      value.currentLongitude ??
      value.currentLng ??
      value.gpsLongitude ??
      value.driverLongitude ??
      value.currentLongitude,
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  )
    return null;

  return { latitude, longitude };
}

function getDriverCoordinates(driver) {
  const candidates = [
    // Backend repository returns live GPS here:
    // availability.currentLatitude / currentLongitude.
    driver?.availability,
    driver?.currentLocation,
    driver?.currentGpsLocation,
    driver?.lastLocation,
    driver?.gpsLocation,
    driver?.location,
    driver?.driverLocation,
    driver?.currentPosition,
    driver?.user?.currentLocation,
    driver?.vehicle?.currentLocation,
    driver?.coordinates,
    driver,
  ];

  for (const candidate of candidates) {
    const coords = readCoordinates(candidate);
    if (coords) return coords;
  }
  return null;
}

function distanceKm(from, to) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = radians(to.latitude - from.latitude);
  const dLng = radians(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

import { Armchair, MapPin, Clock3 } from "lucide-react";

export default function DriverCard({
  driver,

  tripDistance = 0,

  tripDuration = 0,

  pickupLocation = "",

  onDriverSelect,

  loading = false,
}) {
  const vehicle = driver?.vehicle || null;

  const service = driver?.service || null;

  // ============================================================

  // BUSINESS NAME

  // ============================================================

  const businessName =
    driver?.business ||
    driver?.user?.businessName ||
    driver?.user?.fullName ||
    "Driver";

  // ============================================================

  // VEHICLE NAME

  // ============================================================

  const vehicleName = [vehicle?.brand, vehicle?.model]

    .filter(Boolean)

    .join(" ");

  // ============================================================

  // DRIVER FARE

  // ============================================================

  let fareConfig = {};

  const rawFare = service?.fare ?? driver?.fare ?? null;

  if (typeof rawFare === "string") {
    try {
      const parsed = JSON.parse(rawFare);

      if (parsed && typeof parsed === "object") {
        fareConfig = parsed;
      }
    } catch {
      fareConfig = {};
    }
  } else if (rawFare && typeof rawFare === "object") {
    fareConfig = rawFare;
  }

  // Backend direct values are also supported.

  const minimumFareValue = Number(
    driver?.minimumFare ?? fareConfig?.dayFare?.minimumFare,
  );

  const perKmValue = Number(driver?.perKm ?? fareConfig?.dayFare?.perKm);

  const hasMinimumFare =
    Number.isFinite(minimumFareValue) && minimumFareValue > 0;

  const hasPerKm = Number.isFinite(perKmValue) && perKmValue >= 0;

  // Trip distance/duration are pickup-to-destination values.
  const tripKm = Number(tripDistance);
  const tripMinutes = Number(tripDuration);
  const hasTrip = Number.isFinite(tripKm) && tripKm > 0;

  const pickupCoordinates = readCoordinates(pickupLocation);
  const driverCoordinates = getDriverCoordinates(driver);

  // Driver arrival is based on driver -> pickup, never trip duration.
  const driverToPickupKm =
    pickupCoordinates && driverCoordinates
      ? distanceKm(driverCoordinates, pickupCoordinates)
      : null;

  // Approximate urban ETA. This is not live-traffic routing.
  const pickupEtaMinutes =
    driverToPickupKm !== null
      ? Math.max(1, Math.ceil((driverToPickupKm / 25) * 60 + 2))
      : null;

  // Show trip fare only after pickup AND destination are valid (trip distance exists).
  // Minimum fare covers the first 3 km; per-km rate applies only beyond 3 km.
  let displayFare = hasMinimumFare ? minimumFareValue : null;

  if (hasTrip && hasMinimumFare) {
    if (tripKm <= 3) {
      displayFare = minimumFareValue;
    } else if (hasPerKm) {
      displayFare = minimumFareValue + (tripKm - 3) * perKmValue;
    } else {
      displayFare = null;
    }
  }

  const showTripDetails = hasTrip;
  const tripDurationLabel =
    showTripDetails && Number.isFinite(tripMinutes) && tripMinutes > 0
      ? `${Math.round(tripMinutes)} min trip`
      : null;

  // DRIVER SELECT

  // ============================================================

  const handleClick = () => {
    if (loading) {
      return;
    }

    const driverProfileId = driver?.driverProfileId ?? driver?.driverId;

    if (!driverProfileId) {
      console.error(
        "Driver profile ID missing:",

        driver,
      );

      return;
    }

    onDriverSelect?.({
      ...driver,

      driverProfileId,

      calculatedFare: displayFare !== null ? Math.round(displayFare) : null,
    });
  };

  // ============================================================

  // RENDER

  // ============================================================

  return (
    <div
      role="button"
      tabIndex={loading ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();

          handleClick();
        }
      }}
      className={`







        cursor-pointer







        rounded-3xl







        border







        border-neutral-200







        bg-white







        p-4







        shadow-sm







        transition







        hover:shadow-lg







        ${loading ? "pointer-events-none opacity-60" : ""}







      `}
    >
      <div className="flex items-center justify-between gap-4">
        {/* ================================================== */}

        {/* DRIVER */}

        {/* ================================================== */}

        <div className="flex min-w-0 gap-4">
          {/* ================================================== */}

          {/* VEHICLE IMAGE */}

          {/* ================================================== */}

          <div
            className="







              flex







              h-16







              w-16







              shrink-0







              items-center







              justify-center







              overflow-hidden







              rounded-full







              border







              border-neutral-200







              bg-neutral-50







            "
          >
            {vehicle?.image ? (
              <img
                src={vehicle.image}
                alt={vehicleName || "Vehicle"}
                className="







                  h-full







                  w-full







                  object-cover







                "
              />
            ) : (
              <span className="text-2xl">🚕</span>
            )}
          </div>

          {/* ================================================== */}

          {/* DRIVER DETAILS */}

          {/* ================================================== */}

          <div className="min-w-0">
            <h3 className="font-bold text-neutral-900">{businessName}</h3>

            {/* RATING + FAVORITES */}

            <div className="mt-1 flex items-center gap-3">
              {/* 5 STAR RATING */}

              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-sm text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>

                <span className="text-xs font-semibold text-neutral-700">
                  {Number(driver?.rating ?? 5).toFixed(1)}
                </span>

                <span className="text-xs text-neutral-400">
                  ({driver?.ratingCount ?? 0})
                </span>
              </div>

              {/* FAVORITES */}

              <div className="flex items-center gap-1">
                <span className="text-base text-neutral-400">♡</span>

                <span className="text-xs text-neutral-500">
                  {driver?.favoriteCount ?? 0}
                </span>
              </div>
            </div>

            {/* ================================================== */}

            {/* DRIVER META — SINGLE LINE */}

            {/* ================================================== */}

            <div
              className="







                mt-2







                flex







                items-center







                gap-3







                whitespace-nowrap







                text-xs







                text-neutral-500







              "
            >
              {/* SEATS */}

              {vehicle?.seatCapacity && (
                <span className="flex items-center gap-1">
                  <Armchair
                    size={14}
                    strokeWidth={1.8}
                    className="text-neutral-400"
                  />

                  <span>{vehicle.seatCapacity} seats</span>
                </span>
              )}

              {/* SEPARATOR */}

              {vehicle?.seatCapacity && (
                <span className="text-neutral-300">|</span>
              )}

              {/* PASSENGER LOCATION */}

              <span className="flex items-center gap-1">
                <MapPin
                  size={20}
                  strokeWidth={1.6}
                  className="text-neutral-500"
                />

                <span>Nearby</span>
              </span>

              {/* PICKUP ETA */}

              <span className="text-neutral-300">|</span>

              <span className="flex items-center gap-1">
                <Clock3
                  size={20}
                  strokeWidth={1.6}
                  className="text-neutral-500"
                />

                <span>
                  {showTripDetails
                    ? pickupEtaMinutes !== null
                      ? `${pickupEtaMinutes} min arrival`
                      : "Arrival ETA unavailable"
                    : "You"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ================================================== */}

        {/* FARE + ARRIVAL */}

        {/* ================================================== */}

        <div className="shrink-0 text-right">
          {/* FARE */}

          {displayFare !== null ? (
            <p className="text-xl font-bold text-neutral-900">
              ₹{Math.round(displayFare)}
            </p>
          ) : (
            <p className="text-xs font-medium text-neutral-400">
              Fare not configured
            </p>
          )}

          {/* ARRIVAL */}

          {showTripDetails ? (
            <p className="mt-1 text-xs text-neutral-500">
              {tripDurationLabel || "Trip duration unavailable"}
            </p>
          ) : (
            <p className="mt-1 text-xs text-neutral-500">UP TO 3 KM</p>
          )}
        </div>
      </div>

      {/* ================================================== */}

      {/* LOADING */}

      {/* ================================================== */}

      {loading && (
        <div className="mt-3 border-t border-neutral-100 pt-3 text-center text-xs font-medium text-blue-600">
          Selecting driver...
        </div>
      )}
    </div>
  );
}
