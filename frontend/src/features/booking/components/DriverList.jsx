import { useCallback, useEffect, useMemo, useState } from "react";
import "./DriverList.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function DriverList({
  serviceType = "CITYRIDES",
  tripReady = false,
  activeVehicle = "All",
  selectedDriver,
  onDriverSelect,
  pickupLocation,
  destination,
  tripDistance,
  tripDuration,
  fareLoading = false,
}) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDrivers = useCallback(async (signal) => {
    try {
      setError("");
      const token =
        localStorage.getItem("auth_token") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/driver/availability/online`, {
        method: "GET",
        signal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          payload?.message ||
            payload?.error ||
            `Unable to load drivers (${response.status})`,
        );
      setDrivers(extractDriverArray(payload));
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("Nearby driver load failed:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load nearby drivers.",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDrivers(controller.signal);
    const interval = window.setInterval(() => loadDrivers(), 10000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [loadDrivers]);

  const visibleDrivers = useMemo(() => {
    return drivers
      .map((driver) => normalizeDriverFare(driver, serviceType))
      .filter((driver) =>
        matchesVehicle(getDefaultVehicle(driver)?.vehicleType, activeVehicle),
      )
      .map((driver) => {
        const vehicle = getDefaultVehicle(driver);
        const eta = calculateDriverEta(driver, pickupLocation);
        const minimumFare = driver.minimumFare;
        const fare = tripReady
          ? calculateDriverFare(driver, tripDistance)
          : minimumFare;
        return { driver, vehicle, eta, fare, minimumFare };
      })
      .sort((a, b) => {
        if (a.eta.distanceKm == null) return 1;
        if (b.eta.distanceKm == null) return -1;
        return a.eta.distanceKm - b.eta.distanceKm;
      });
  }, [
    drivers,
    activeVehicle,
    serviceType,
    pickupLocation,
    tripReady,
    tripDistance,
  ]);

  return (
    <section className="gosago-drivers" aria-label="Nearby drivers">
      <div className="gosago-drivers__heading pt-3">
        <h2>Nearby Drivers</h2>
        <span className="gosago-drivers__radius">Within 3 km</span>
      </div>

      {loading && (
        <div className="gosago-driver-state">Finding nearby drivers…</div>
      )}
      {!loading && error && (
        <div className="gosago-driver-state gosago-driver-state--error">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadDrivers();
            }}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && visibleDrivers.length === 0 && (
        <div className="gosago-driver-state">
          <span className="gosago-driver-state__icon">🚕</span>
          <strong>No drivers available</strong>
          <span>
            No online drivers are currently available for this vehicle type.
          </span>
        </div>
      )}

      {!loading && !error && visibleDrivers.length > 0 && (
        <div className="gosago-driver-list">
          {visibleDrivers.map(({ driver, vehicle, eta, fare, minimumFare }) => {
            const id = driver.id ?? driver.driverProfileId ?? driver.user?.id;
            const driverName =
              driver.user?.fullName ||
              driver.fullName ||
              driver.driverName ||
              "Driver";
            const businessName =
              driver.businessName ||
              driver.user?.businessName ||
              driver.company?.name ||
              driverName;
            const model =
              [vehicle?.brand, vehicle?.model].filter(Boolean).join(" ") ||
              formatVehicleType(vehicle?.vehicleType);
            const seats =
              vehicle?.seatCapacity ??
              vehicle?.seats ??
              vehicle?.seatingCapacity ??
              "—";
            const rating =
              driver.rating?.average ??
              driver.averageRating ??
              driver.rating ??
              driver.reviewRating ??
              null;
            const ratingNumber =
              typeof rating === "object"
                ? Number(rating?.value)
                : Number(rating);
            const isSelected =
              String(
                selectedDriver?.id ?? selectedDriver?.driverProfileId ?? "",
              ) === String(id);
            const image = getVehicleImage(vehicle);
            const canSelect = Boolean(
              tripReady && pickupLocation && destination,
            );

            return (
              <button
                className={`gosago-driver-card${isSelected ? " is-selected" : ""}${!canSelect ? " is-not-selectable" : ""}`}
                key={id ?? `${businessName}-${vehicle?.vehicleNumber ?? model}`}
                type="button"
                disabled={!canSelect}
                aria-disabled={!canSelect}
                title={
                  canSelect
                    ? `Select ${businessName}`
                    : "Enter a valid pickup and destination to select a driver"
                }
                onClick={() => canSelect && onDriverSelect?.(driver)}
              >
                <span className="gosago-driver-card__vehicle">
                  <img
                    src={image}
                    alt={formatVehicleType(vehicle?.vehicleType)}
                    onError={(event) => {
                      event.currentTarget.src = fallbackVehicleImage(
                        vehicle?.vehicleType,
                      );
                    }}
                  />
                </span>

                <span className="gosago-driver-card__details">
                  <span className="gosago-driver-card__title-line">
                    <strong className="gosago-driver-card__business">
                      {businessName}
                    </strong>
                  </span>

                  <span className="gosago-driver-card__rating-line">
                    <span className="gosago-driver-card__rating">
                      ★{" "}
                      {Number.isFinite(ratingNumber) && ratingNumber > 0
                        ? ratingNumber.toFixed(1)
                        : "New"}
                    </span>
                    <span className="gosago-driver-card__dot">•</span>
                    <span>{seats} Seats</span>
                    <span className="gosago-driver-card__dot">•</span>
                    <span>
                      {eta.distanceKm != null
                        ? `${eta.distanceKm.toFixed(1)} km`
                        : "Nearby"}
                    </span>
                    <span className="gosago-driver-card__dot">•</span>
                    <span>
                      {eta.minutes != null ? `${eta.minutes} min` : "ETA —"}
                    </span>
                  </span>
                  <span className="gosago-driver-card__tag">
                    {tripReady ? "Ride estimate" : "Minimum fare"}
                  </span>
                </span>

                <span className="gosago-driver-card__fare">
                  <strong>
                    {fareLoading && tripReady
                      ? "…"
                      : fare != null &&
                          Number.isFinite(Number(fare)) &&
                          Number(fare) > 0
                        ? `₹${Math.round(Number(fare))}`
                        : "₹—"}
                  </strong>
                  <span>{tripReady ? "Est. fare" : "Min fare"}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function extractDriverArray(payload) {
  const candidates = [
    payload,
    payload?.data,
    payload?.drivers,
    payload?.items,
    payload?.results,
    payload?.data?.drivers,
    payload?.data?.items,
    payload?.data?.results,
    payload?.result?.data,
    payload?.result?.drivers,
  ];
  return candidates.find(Array.isArray) || [];
}

function normalizeDriverFare(driver, requestedServiceType) {
  const requested = String(requestedServiceType || "CITYRIDES")
    .trim()
    .toUpperCase();
  const candidates = [
    driver?.service,
    driver?.activeService,
    driver?.driverService,
    ...(Array.isArray(driver?.services) ? driver.services : []),
    ...(Array.isArray(driver?.driverServices) ? driver.driverServices : []),
    ...(Array.isArray(driver?.DriverService) ? driver.DriverService : []),
    ...(Array.isArray(driver?.DriverServices) ? driver.DriverServices : []),
    driver?.driver?.service,
    driver?.driver?.activeService,
    ...(Array.isArray(driver?.driver?.services) ? driver.driver.services : []),
    ...(Array.isArray(driver?.driver?.driverServices)
      ? driver.driver.driverServices
      : []),
  ].filter(Boolean);
  const getType = (item) =>
    String(
      item?.serviceType ??
        item?.type ??
        item?.code ??
        item?.service?.serviceType ??
        "",
    )
      .trim()
      .toUpperCase();
  const service =
    candidates.find((item) => getType(item) === requested) ||
    (candidates.length === 1 ? candidates[0] : null);
  const source =
    service?.dayFare ||
    service?.fare?.dayFare ||
    service?.fares?.day ||
    service?.pricing?.dayFare ||
    service?.pricing ||
    service?.fare ||
    service ||
    driver?.dayFare ||
    driver?.fare?.dayFare ||
    driver?.pricing ||
    driver?.fare ||
    driver;
  const firstNumber = (...values) => {
    for (const value of values) {
      if (value === null || value === undefined || value === "") continue;
      const n = Number(value);
      if (Number.isFinite(n)) return n;
    }
    return null;
  };
  return {
    ...driver,
    minimumFare: firstNumber(
      source?.minimumFare,
      source?.minFare,
      source?.baseFare,
      source?.minimum,
      source?.fareMinimum,
      driver?.minimumFare,
      driver?.minFare,
    ),
    perKm: firstNumber(
      source?.perKm,
      source?.perKM,
      source?.perKmFare,
      source?.ratePerKm,
      source?.pricePerKm,
      driver?.perKm,
      driver?.perKM,
    ),
  };
}

function calculateDriverFare(driver, distanceKm) {
  const min = Number(driver?.minimumFare);
  if (!Number.isFinite(min) || min <= 0) return null;
  const km = Number(distanceKm);
  const perKm = Number(driver?.perKm);
  if (!Number.isFinite(km) || km <= 0 || !Number.isFinite(perKm) || perKm < 0)
    return min;
  return min + km * perKm;
}

function getDefaultVehicle(driver) {
  const vehicles = [
    ...(Array.isArray(driver?.Vehicle) ? driver.Vehicle : []),
    ...(Array.isArray(driver?.vehicles) ? driver.vehicles : []),
    ...(driver?.vehicle ? [driver.vehicle] : []),
    ...(driver?.approvedVehicle ? [driver.approvedVehicle] : []),
  ];
  return (
    vehicles.find((v) => v?.isDefault === true && v?.isActive !== false) ||
    vehicles.find((v) => v?.isActive !== false) ||
    vehicles[0] ||
    null
  );
}

function normalizeVehicleType(type) {
  return String(type || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}
function formatVehicleType(type) {
  const normalized = normalizeVehicleType(type);
  if (normalized.includes("AUTO") || normalized.includes("RICKSHAW"))
    return "Auto";
  if (
    normalized.includes("PREMIUM") ||
    normalized.includes("SUV") ||
    normalized.includes("LUXURY")
  )
    return "Premium";
  if (normalized.includes("BIKE") || normalized.includes("MOTORCYCLE"))
    return "Bike";
  if (
    normalized.includes("CAB") ||
    normalized.includes("CAR") ||
    normalized.includes("SEDAN")
  )
    return "Cab";
  return String(type || "Vehicle")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function matchesVehicle(type, selected) {
  const t = normalizeVehicleType(type);
  const s = normalizeVehicleType(selected);
  if (!s || s === "ALL" || s === "FAVORITE") return true;
  if (s.includes("CAB") || s.includes("CAR"))
    return (
      t.includes("CAB") ||
      t.includes("CAR") ||
      t.includes("SEDAN") ||
      t.includes("PREMIUM") ||
      t.includes("SUV")
    );
  if (s.includes("AUTO")) return t.includes("AUTO") || t.includes("RICKSHAW");
  if (s.includes("BIKE"))
    return (
      t.includes("BIKE") ||
      t.includes("MOTORCYCLE") ||
      t.includes("TWO_WHEELER")
    );
  if (s.includes("PREMIUM"))
    return t.includes("PREMIUM") || t.includes("SUV") || t.includes("LUXURY");
  return t === s || t.startsWith(`${s}_`) || t.includes(s);
}

function getVehicleImage(vehicle) {
  const supplied =
    vehicle?.imageUrl ||
    vehicle?.image ||
    vehicle?.photoUrl ||
    vehicle?.vehicleImage ||
    vehicle?.images?.[0]?.url ||
    vehicle?.images?.[0];
  if (typeof supplied === "string" && supplied.trim()) return supplied;
  return fallbackVehicleImage(vehicle?.vehicleType);
}
function fallbackVehicleImage(type) {
  const t = normalizeVehicleType(type);
  if (t.includes("AUTO") || t.includes("RICKSHAW"))
    return "/images/vehicles/auto.png";
  if (t.includes("PREMIUM") || t.includes("SUV") || t.includes("LUXURY"))
    return "/images/vehicles/premium.png";
  if (t.includes("BIKE") || t.includes("MOTORCYCLE"))
    return "/images/vehicles/cab.png";
  return "/images/vehicles/cab.png";
}

function calculateDriverEta(driver, pickup) {
  const availability =
    driver?.availability ||
    driver?.DriverAvailability ||
    driver?.driverAvailability ||
    {};
  const driverLat = Number(
    availability.currentLatitude ??
      availability.latitude ??
      driver?.currentLatitude ??
      driver?.latitude,
  );
  const driverLng = Number(
    availability.currentLongitude ??
      availability.longitude ??
      driver?.currentLongitude ??
      driver?.longitude,
  );
  const pickupLat = Number(pickup?.latitude ?? pickup?.lat);
  const pickupLng = Number(pickup?.longitude ?? pickup?.lng ?? pickup?.lon);
  if (![driverLat, driverLng, pickupLat, pickupLng].every(Number.isFinite))
    return { distanceKm: null, minutes: null };
  const distanceKm = distance(driverLat, driverLng, pickupLat, pickupLng);
  return {
    distanceKm,
    minutes: Math.max(1, Math.round((distanceKm / 25) * 60)),
  };
}
function distance(lat1, lon1, lat2, lon2) {
  const rad = (v) => (v * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
