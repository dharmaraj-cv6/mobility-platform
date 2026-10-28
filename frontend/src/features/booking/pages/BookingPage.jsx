import { useEffect, useMemo, useState } from "react";

import { Home, Plus, Repeat2, Route } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import LocationCard from "../components/LocationCard";
import DriverList from "../components/DriverList";
import VehicleFilter from "../components/VehicleFilter";
import FavoriteDrivers from "../components/FavoriteDrivers";

// ============================================================
// BOOKING PAGE
// ============================================================
//
// Current booking-flow rules:
//
// 1. Always show nearby drivers, even before locations are entered.
// 2. Before pickup + destination are valid, show each driver's minimum fare.
// 3. Once both locations are valid, show the estimated trip fare.
// 4. Driver selection is allowed only after both locations are valid.
// 3. Home-page vehicle type is carried into "My" filter.
// 4. "Favorite" uses FavoriteDrivers.
// 5. Driver fare is still owned by DriverList / driver's active
//    service fare. This page only supplies the calculated trip.
// 6. Driver reservation / confirmation remains in the existing
//    DriverList -> ConfirmationPage flow.
// ============================================================

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingState = location.state || {};

  // ============================================================
  // BOOKING STATE FROM HOME
  // ============================================================

  const serviceType = bookingState.serviceType || "CITYRIDES";

  const homeVehicleType = bookingState.vehicleType || "All";

  const initialPickupLocation = bookingState.pickupLocation || null;

  const initialDestination = bookingState.destination || "";

  const initialDestinationLocation = bookingState.destinationLocation || null;

  // ============================================================
  // RIDE TYPE
  // ============================================================

  const [rideType, setRideType] = useState(bookingState.rideType || "BOOK_NOW");

  // ============================================================
  // VEHICLE FILTER
  //
  // All      = all eligible vehicles
  // My       = vehicle type selected on Home
  // Favorite = favorite drivers
  // ============================================================

  const [activeVehicle, setActiveVehicle] = useState("All");

  // ============================================================
  // PICKUP
  // ============================================================

  const [pickupLocation, setPickupLocation] = useState(initialPickupLocation);

  // ============================================================
  // DESTINATION
  // ============================================================

  const [destination, setDestination] = useState(initialDestination);

  const [destinationLocation, setDestinationLocation] = useState(
    initialDestinationLocation,
  );

  // ============================================================
  // TRIP MODE
  //
  // ONE_WAY / ROUND_TRIP
  // ============================================================

  const [tripMode, setTripMode] = useState(bookingState.tripMode || "ONE_WAY");

  // ============================================================
  // SELECTED DRIVER
  // ============================================================

  const [selectedDriver, setSelectedDriver] = useState(null);

  // ============================================================
  // SMALL VALIDATION MESSAGE
  // ============================================================

  const [fareMessage, setFareMessage] = useState("");

  // ============================================================
  // AUTO-CLOSE VALIDATION MESSAGE
  // ============================================================

  useEffect(() => {
    if (!fareMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFareMessage("");
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fareMessage]);

  // ============================================================
  // REAL BROWSER GPS
  //
  // If Home already supplied pickup coordinates, keep them.
  // ============================================================

  useEffect(() => {
    if (pickupLocation?.latitude != null && pickupLocation?.longitude != null) {
      return;
    }

    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return;
        }

        setPickupLocation({
          latitude,
          longitude,
          accuracy,
          name: "",
        });
      },
      (error) => {
        console.error("BOOKING GPS ERROR:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, [pickupLocation]);

  // ============================================================
  // TRIP CALCULATION
  //
  // IMPORTANT:
  // Never calculate a fare/trip distance with only one location.
  // Distance is valid ONLY when both coordinates exist.
  // ============================================================

  const trip = useMemo(() => {
    if (
      !hasValidCoordinates(pickupLocation) ||
      !hasValidCoordinates(destinationLocation)
    ) {
      return {
        distance: 0,
        duration: 0,
        ready: false,
      };
    }

    const pickupLat = Number(pickupLocation.latitude);

    const pickupLng = Number(pickupLocation.longitude);

    const destinationLat = Number(destinationLocation.latitude);

    const destinationLng = Number(destinationLocation.longitude);

    const distance = calculateDistanceKm(
      pickupLat,
      pickupLng,
      destinationLat,
      destinationLng,
    );

    const duration = Math.max(1, Math.round((distance / 30) * 60));

    return {
      distance,
      duration,
      ready: distance > 0,
    };
  }, [pickupLocation, destinationLocation]);

  // ============================================================
  // RESET SELECTION
  // ============================================================

  const resetSelection = () => {
    setSelectedDriver(null);
  };

  // ============================================================
  // PICKUP CHANGE
  // ============================================================

  const handlePickupChange = (locationData) => {
    setPickupLocation(locationData);

    resetSelection();
  };

  // ============================================================
  // DESTINATION CHANGE
  // ============================================================

  const handleDestinationChange = (name, coordinates = null) => {
    setDestination(name);

    setDestinationLocation(coordinates);

    resetSelection();
  };

  // ============================================================
  // VEHICLE FILTER
  // ============================================================

  const handleVehicleChange = (vehicle) => {
    setActiveVehicle(vehicle);

    resetSelection();
  };

  // ============================================================
  // DRIVER SELECTION GUARD
  //
  // DriverList already owns the reservation flow.
  // This page only guarantees that a driver cannot be selected
  // before pickup + destination are available.
  // ============================================================

  const handleDriverSelect = (driver) => {
    if (!driver || !trip.ready) {
      setFareMessage(
        "Enter both pickup and destination before selecting a driver.",
      );
      return;
    }

    const driverProfileId = Number(
      driver.driverProfileId ?? driver.driverId ?? driver.id,
    );

    if (!Number.isSafeInteger(driverProfileId) || driverProfileId <= 0) {
      setFareMessage(
        "This driver's profile is unavailable. Please choose another driver.",
      );
      return;
    }

    const minimumFare = Number(
      driver.minimumFare ?? driver.minFare ?? driver.baseFare,
    );
    const perKm = Number(driver.perKm ?? driver.perKM ?? driver.perKmFare);
    const numericMinimum =
      Number.isFinite(minimumFare) && minimumFare > 0 ? minimumFare : null;
    const estimatedFare =
      numericMinimum == null
        ? null
        : Math.ceil(
            Number.isFinite(perKm) && perKm >= 0
              ? numericMinimum + perKm * trip.distance
              : numericMinimum,
          );

    const vehicle =
      driver?.Vehicle?.find(
        (item) => item?.isDefault && item?.isActive !== false,
      ) ||
      driver?.Vehicle?.find((item) => item?.isActive !== false) ||
      driver?.Vehicle?.[0] ||
      driver?.vehicle ||
      null;

    const normalizedDriver = {
      ...driver,
      driverProfileId,
      driverId: Number(driver.driverId ?? driverProfileId),
      minimumFare: numericMinimum,
      perKm: Number.isFinite(perKm) ? perKm : null,
    };

    setSelectedDriver(normalizedDriver);

    // Book Now and Schedule use the same booking/confirmation flow.
    // Share Ride is a separate route and is intentionally not changed here.
    navigate("/confirmation", {
      state: {
        ...bookingState,
        driver: normalizedDriver,
        selectedDriver: normalizedDriver,
        driverId: normalizedDriver.driverId,
        driverProfileId,
        vehicle,
        serviceType,
        rideType,
        tripMode,
        pickupLocation,
        pickup: pickupLocation,
        pickupAddress: pickupLocation?.name || pickupLocation?.address || "",
        pickupLatitude: Number(pickupLocation.latitude),
        pickupLongitude: Number(pickupLocation.longitude),
        destination,
        destinationLocation,
        dropAddress: destination,
        drop: destinationLocation,
        dropLatitude: Number(destinationLocation.latitude),
        dropLongitude: Number(destinationLocation.longitude),
        tripDistance: trip.distance,
        distance: trip.distance,
        estimatedDistance: trip.distance,
        tripDuration: trip.duration,
        duration: trip.duration,
        estimatedDuration: trip.duration,
        fare: estimatedFare,
        minimumFare: numericMinimum,
        perKm: Number.isFinite(perKm) ? perKm : null,
        vehicleType: activeVehicle,
        scheduledDate:
          bookingState.scheduledDate ?? bookingState.selectedDate ?? null,
        scheduledTime:
          bookingState.scheduledTime ?? bookingState.selectedTime ?? null,
      },
    });
  };

  // ============================================================
  // ADD STOP
  //
  // UI-only icon for the next stop-location implementation.
  // No fake stop is inserted into the booking payload.
  // ============================================================

  const handleAddStop = () => {
    setFareMessage("Add stop can be selected after the destination.");
  };

  // ============================================================
  // MY VEHICLE LABEL
  // ============================================================

  const myVehicleLabel = formatVehicleType(homeVehicleType);

  // ============================================================
  // DRIVER AREA
  // Drivers stay visible at all times. Fare display changes with
  // trip readiness inside DriverList; selection remains guarded.
  // ============================================================

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="booking-page-readable min-h-screen w-full overflow-x-hidden bg-[#f3f7ff]">
      <div
        className="
          mx-auto
          min-h-screen
          w-full
          max-w-[390px]
          space-y-3
          overflow-x-hidden
          border-x
          border-blue-200
          bg-[#f7faff]
          px-2.5
          py-2.5
          shadow-sm
        "
      >
        {/* MAP HEADER — same visual map as HomePage; booking logic unchanged */}
        <section
          className="booking-home-map home-map"
          aria-label="Map and current location"
        >
          <div className="map-blocks" />
          <div className="map-roads" />
          <div className="map-road road-a" />
          <div className="map-road road-b" />
          <div className="map-road road-c" />
          <button
            className="location-pill"
            type="button"
            aria-label="Choose pickup location"
          >
            <span aria-hidden="true">📍</span>
            <span>Coimbatore, Tamil Nadu</span>
            <span className="location-chevron">⌄</span>
          </button>
          <button
            type="button"
            className="notification-button"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
          >
            ♡
          </button>
          <span className="map-pin map-pin-a" />
          <span className="map-pin map-pin-b" />
          <span className="map-pin map-pin-c" />
          <span className="map-pin map-pin-d" />
          <span className="map-car map-car-a">◆</span>
          <span className="map-car map-car-b">◆</span>
          <span className="map-car map-car-c">◆</span>
          <span className="map-car map-car-d">◆</span>
          <span className="gps-halo">
            <span />
          </span>
        </section>
        <style>{`
          .booking-home-map {
            position: relative; flex: 0 0 auto; width: calc(100% + 20px);
            height: 132px; margin-left: -10px; margin-top: -10px;
            overflow: hidden; background: #eaf4f8;
          }
          .booking-home-map .map-blocks { position:absolute; inset:0; background:radial-gradient(ellipse at 15% 18%,#d6efd3 0 11%,transparent 11.5%),radial-gradient(ellipse at 91% 25%,#d8f0d4 0 12%,transparent 12.5%),radial-gradient(ellipse at 78% 89%,#d9f1d4 0 13%,transparent 13.5%),radial-gradient(ellipse at 5% 84%,#dff2d9 0 9%,transparent 9.5%); }
          .booking-home-map .map-roads { position:absolute; inset:-30%; transform:rotate(-18deg); background:repeating-linear-gradient(35deg,transparent 0 35px,#fff 36px 41px,#e7e8dc 42px 44px,transparent 45px 76px),repeating-linear-gradient(128deg,transparent 0 58px,#fff 59px 64px,#e7e8dc 65px 67px,transparent 68px 105px); }
          .booking-home-map .map-road { position:absolute; height:6px; width:140%; left:-20%; background:#fff; border-top:1px solid #e6e5d9; border-bottom:1px solid #e6e5d9; }
          .booking-home-map .road-a { top:27%; transform:rotate(25deg); } .booking-home-map .road-b { top:65%; transform:rotate(-36deg); } .booking-home-map .road-c { top:80%; transform:rotate(20deg); }
          .booking-home-map .location-pill { position:absolute; z-index:3; top:12%; left:8%; display:flex; align-items:center; gap:4px; max-width:76%; padding:5px 8px; border:1px solid #e9eef5; border-radius:18px; background:#fff; box-shadow:0 2px 6px #17274b0d; color:#34435e; font-size:10px; font-weight:600; white-space:nowrap; }
          .booking-home-map .location-chevron { color:#8b97aa; }
          .booking-home-map .notification-button { position:absolute; z-index:3; top:10%; right:7%; display:grid; width:27px; height:27px; place-items:center; border:1px solid #e9eef5; border-radius:50%; background:#fff; color:#1679ff; }
          .booking-home-map .map-pin { position:absolute; z-index:2; width:7px; height:7px; border-radius:50% 50% 50% 0; background:#ffbf27; box-shadow:0 1px 3px #8c6c2525; transform:rotate(-45deg); }
          .booking-home-map .map-pin-a { top:43%; left:11%; } .booking-home-map .map-pin-b { top:35%; right:12%; } .booking-home-map .map-pin-c { bottom:11%; right:27%; } .booking-home-map .map-pin-d { top:20%; left:52%; width:5px; height:5px; }
          .booking-home-map .map-car { position:absolute; z-index:2; width:12px; height:6px; border:1px solid #172d48; border-radius:3px; background:#25b9e8; color:transparent; box-shadow:inset 0 -2px #fff; transform:rotate(38deg); }
          .booking-home-map .map-car-a { top:31%; left:41%; } .booking-home-map .map-car-b { top:57%; right:18%; background:#f25e4c; } .booking-home-map .map-car-c { bottom:19%; left:29%; background:#25b9a6; } .booking-home-map .map-car-d { top:70%; left:12%; background:#fff; }
          .booking-home-map .gps-halo { position:absolute; z-index:3; top:47%; left:50%; display:grid; width:27px; height:27px; place-items:center; border-radius:50%; background:#b7d7ff70; transform:translate(-50%,-50%); }
          .booking-home-map .gps-halo span { width:12px; height:12px; border:2px solid #fff; border-radius:50%; background:#167bff; box-shadow:0 1px 6px #167bff80; }
        `}</style>

        <style>{`
          /* Readability-only refinements; booking logic and section order remain unchanged. */
          .booking-page-readable { font-size: 14px; line-height: 1.45; color: #172746; }
          .booking-page-readable > div { gap: 14px; padding-top: 12px; padding-bottom: 12px; }
          .booking-page-readable .booking-home-map { height: 148px; }
          .booking-page-readable .booking-home-map .location-pill { gap: 6px; padding: 7px 10px; font-size: 12px; line-height: 1.2; }
          .booking-page-readable .booking-home-map .notification-button { width: 32px; height: 32px; font-size: 16px; }
          .booking-page-readable .page-section { margin-top: 2px; margin-bottom: 2px; }
          .booking-page-readable input, .booking-page-readable select, .booking-page-readable textarea { font-size: 14px !important; line-height: 1.4 !important; min-height: 24px; }
          .booking-page-readable label { font-size: 12px; line-height: 1.4; }
          .booking-page-readable button { line-height: 1.35; }
          .booking-page-readable .page-section button { min-height: 38px; }
          .booking-page-readable nav { padding-top: 10px; padding-bottom: 10px; }
          .booking-page-readable nav button { min-height: 42px; gap: 3px; font-size: 11px; }
          .booking-page-readable nav button > span:first-child { font-size: 19px; line-height: 1.1; }
          @media (max-width: 360px) { .booking-page-readable > div { padding-left: 9px; padding-right: 9px; gap: 12px; } .booking-page-readable .booking-home-map { height: 138px; } .booking-page-readable .booking-home-map .location-pill { max-width: 78%; font-size: 11px; } }
        `}</style>

        {/* =====================================================
            LOCATION
        ===================================================== */}

        <section
          className="
            page-section
            relative
          "
        >
          <LocationCard
            pickupLocation={pickupLocation}
            destination={destination}
            destinationLocation={destinationLocation}
            onPickupChange={handlePickupChange}
            onDestinationChange={handleDestinationChange}
          />
        </section>

        {/* =====================================================
            SMALL FARE VALIDATION POPUP
        ===================================================== */}

        {fareMessage && (
          <div
            className="
              mx-auto
              w-fit
              rounded-full
              border
              border-amber-200
              bg-amber-50
              px-4
              py-2
              text-center
              text-xs
              font-medium
              text-amber-800
              shadow-sm
            "
            role="status"
          >
            {fareMessage}
          </div>
        )}

        {/* VEHICLE FILTERS */}
        <section className="page-section pt-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterButton
              active={activeVehicle === "All"}
              label="All"
              icon="✦"
              onClick={() => handleVehicleChange("All")}
            />

            <FilterButton
              active={activeVehicle === "Auto"}
              label="Your best"
              icon="🛺"
              onClick={() => handleVehicleChange("Auto")}
            />

            <FilterButton
              active={activeVehicle === "Favorite"}
              label="Favorite"
              icon="♡"
              onClick={() => handleVehicleChange("Favorite")}
            />
          </div>
        </section>

        {/* =====================================================
            DRIVERS
        ===================================================== */}

        <section
          className="
            page-section
          "
        >
          {activeVehicle === "Favorite" && (
            <FavoriteDrivers
              selectedDriver={selectedDriver}
              onDriverSelect={handleDriverSelect}
              pickupLocation={pickupLocation}
              destination={destination}
              destinationLocation={destinationLocation}
              tripDistance={trip.distance}
              tripDuration={trip.duration}
            />
          )}

          {activeVehicle !== "Favorite" && (
            <DriverList
              serviceType={serviceType}
              tripReady={trip.ready}
              activeVehicle={activeVehicle}
              selectedDriver={selectedDriver}
              onDriverSelect={handleDriverSelect}
              pickupLocation={pickupLocation}
              destination={destination}
              destinationLocation={destinationLocation}
              bookingData={{
                pickupLocation,
                destination,
                destinationLocation,
                serviceType,
                vehicleType: activeVehicle,
                rideType,
                tripMode,
              }}
              tripDistance={trip.distance}
              tripDuration={trip.duration}
            />
          )}
        </section>

        <nav
          className="sticky bottom-0 z-20 -mx-2.5 mt-3 grid grid-cols-4 border-t border-blue-100 bg-white/95 px-2 py-2 backdrop-blur"
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-0.5 text-[9px] font-semibold text-blue-600"
          >
            <span className="text-base">⌂</span>
            <span>City Ride</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/booking")}
            className="flex flex-col items-center gap-0.5 text-[9px] font-semibold text-slate-500"
          >
            <span className="text-base">▤</span>
            <span>Booking</span>
          </button>
          <button
            type="button"
            onClick={() => handleVehicleChange("Favorite")}
            className="flex flex-col items-center gap-0.5 text-[9px] font-semibold text-slate-500"
          >
            <span className="text-base">♡</span>
            <span>Favorite</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/account")}
            className="flex flex-col items-center gap-0.5 text-[9px] font-semibold text-slate-500"
          >
            <span className="text-base">♟</span>
            <span>Account</span>
          </button>
        </nav>
      </div>
    </main>
  );
}

// ============================================================
// FILTER BUTTON
// ============================================================

function FilterButton({ active, label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        shrink-0
        items-center
        gap-2
        rounded-full
        border
        px-4
        py-3
        text-[14px]
        font-semibold
        transition
        ${
          active
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-neutral-200 bg-white text-neutral-700 hover:border-blue-300"
        }
      `}
    >
      <span
        className="
          text-base
          leading-none
        "
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

// ============================================================
// COORDINATE VALIDATION
// ============================================================

function hasValidCoordinates(location) {
  if (!location) {
    return false;
  }

  const latitude = Number(location.latitude);

  const longitude = Number(location.longitude);

  return Number.isFinite(latitude) && Number.isFinite(longitude);
}

// ============================================================
// DISTANCE
// ============================================================

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;

  const dLat = toRadians(lat2 - lat1);

  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

// ============================================================
// RADIANS
// ============================================================

function toRadians(value) {
  return (value * Math.PI) / 180;
}

// ============================================================
// VEHICLE LABEL
// ============================================================

function formatVehicleType(value) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();

  const labels = {
    BIKE: "Bike",
    AUTO: "Auto",
    CAB_4: "Cab",
    CAB_5: "Cab 5",
    CAB_6: "Cab 6",
    CAB_7: "Cab 7",
    CAB_9: "Cab 9",
    MINI_BUS: "Mini Bus",
    BUS: "Bus",
    LCV: "LCV",
    HCV: "HCV",
  };

  return (
    labels[normalized] ||
    String(value || "Vehicle")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}
