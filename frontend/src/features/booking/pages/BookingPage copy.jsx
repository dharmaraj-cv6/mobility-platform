import { useEffect, useMemo, useState } from "react";

import { Home, Plus, Repeat2, Route } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import LocationCard from "../components/LocationCard";

import DriverList from "../components/DriverList";

import FavoriteDrivers from "../components/FavoriteDrivers";

// ============================================================

// BOOKING PAGE

// ============================================================

//

// CURRENT BOOKING FLOW

//

// 1. Pickup is required before nearby drivers are shown.

// 2. Destination is optional initially.

// 3. Driver cards can remain visible with pickup only.

// 4. Driver minimum fare is handled by DriverList.

// 5. Trip fare is calculated only after both coordinates exist.

// 6. Driver selection is allowed only when pickup + destination

//    coordinates are valid.

// 7. Home vehicle type is available through "My".

// 8. Favorite drivers use FavoriteDrivers.

// 9. Driver reservation / confirmation remains inside the

//    existing DriverList -> ConfirmationPage flow.

// ============================================================

export default function BookingPage() {
  const location = useLocation();

  const navigate = useNavigate();

  const bookingState = location.state || {};

  // ============================================================

  // BOOKING DATA FROM HOME

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

  // ============================================================

  const [tripMode, setTripMode] = useState(bookingState.tripMode || "ONE_WAY");

  // ============================================================

  // SELECTED DRIVER

  // ============================================================

  const [selectedDriver, setSelectedDriver] = useState(null);

  // ============================================================

  // VALIDATION MESSAGE

  // ============================================================

  const [fareMessage, setFareMessage] = useState("");

  // ============================================================

  // AUTO CLOSE MESSAGE

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
  // BROWSER GPS
  // Use real GPS when available; otherwise fall back to Coimbatore.
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const coimbatoreFallback = {
      latitude: 11.0168,
      longitude: 76.9558,
      accuracy: null,
      name: "Coimbatore, Tamil Nadu",
      source: "fallback",
    };

    // Preserve a pickup supplied by Home or selected by the user.
    if (hasValidCoordinates(initialPickupLocation)) {
      return;
    }

    const applyFallback = () => {
      if (!cancelled) setPickupLocation(coimbatoreFallback);
    };

    if (!navigator.geolocation) {
      queueMicrotask(applyFallback);
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        const { latitude, longitude, accuracy } = position.coords;

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          applyFallback();
          return;
        }

        console.log("PASSENGER GPS:", { latitude, longitude, accuracy });
        setPickupLocation({
          latitude,
          longitude,
          accuracy,
          name: "Current location",
          source: "gps",
        });
      },
      (error) => {
        console.error("BOOKING GPS ERROR:", error.message);
        applyFallback();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // TRIP CALCULATION

  //

  // Distance is calculated ONLY when both pickup and destination

  // coordinates are available.

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

  // RESET DRIVER SELECTION

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

  // VEHICLE FILTER CHANGE

  // ============================================================

  const handleVehicleChange = (vehicle) => {
    setActiveVehicle(vehicle);

    resetSelection();
  };

  // ============================================================

  // DRIVER SELECT

  //

  // DriverList continues to own reservation logic.

  // ============================================================

  const handleDriverSelect = (driver) => {
    if (!hasValidCoordinates(pickupLocation)) {
      setFareMessage("Please select your pickup location first.");

      return;
    }

    if (!hasValidCoordinates(destinationLocation)) {
      setFareMessage("Please enter your destination and check the fare.");

      return;
    }

    if (!trip.ready) {
      setFareMessage("Please enter valid pickup and destination locations.");

      return;
    }

    setSelectedDriver(driver);

    // Continue to ConfirmationPage with the selected driver and trip data.
    // Keep the existing DriverList/backend reservation flow responsible for
    // acquiring the temporary driver lock before this callback is invoked.
    navigate("/confirmation", {
      state: {
        ...bookingState,
        driver,
        selectedDriver: driver,
        pickupLocation,
        destination,
        destinationLocation,
        serviceType,
        vehicleType: activeVehicle,
        rideType,
        tripMode,
        tripDistance: trip.distance,
        tripDuration: trip.duration,
      },
    });
  };

  // ============================================================

  // ADD STOP

  // ============================================================

  const handleAddStop = () => {
    if (!destination) {
      setFareMessage("Please enter the destination first.");

      return;
    }

    setFareMessage("Add stop can be selected after the destination.");
  };

  // ============================================================

  // MY VEHICLE LABEL

  // ============================================================

  const myVehicleLabel = formatVehicleType(homeVehicleType);

  // ============================================================

  // DRIVER VISIBILITY

  //

  // IMPORTANT:

  // Drivers become visible once pickup exists.

  //

  // DriverList decides actual driver availability.
  // No fixed 7 km distance limit is applied in this page.

  // ============================================================

  const canShowDrivers = Boolean(pickupLocation);

  // ============================================================

  // RENDER

  // ============================================================

  return (
    <main className="min-h-screen bg-neutral-50">
      <div
        className="

          mx-auto

          mt-[52px]

          max-w-5xl

          space-y-5

          bg-white

          px-4

          py-4

          sm:px-6

          lg:px-8

        "
      >
        {/* =====================================================

            HEADER

        ===================================================== */}

        <header
          className="

            flex

            items-center

            justify-between

            border-b

            border-neutral-100

            pb-3

          "
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Back to home"
            className="

              flex

              h-10

              w-10

              items-center

              justify-center

              rounded-full

              border

              border-neutral-200

              bg-white

              text-neutral-700

              transition

              hover:bg-neutral-50

            "
          >
            <Home size={19} strokeWidth={2} />
          </button>

          <h2
            className="

              text-lg

              font-semibold

              text-neutral-900

            "
          >
            Choose your ride
          </h2>

          {/* BOOK NOW / SCHEDULE */}

          <div
            className="

              flex

              rounded-full

              border

              border-neutral-200

              bg-neutral-50

              p-1

            "
          >
            <button
              type="button"
              onClick={() => setRideType("BOOK_NOW")}
              className={`

                rounded-full

                px-3

                py-1.5

                text-xs

                font-semibold

                transition

                ${
                  rideType === "BOOK_NOW"
                    ? "bg-blue-600 text-white"
                    : "text-neutral-600"
                }

              `}
            >
              Book Now
            </button>

            <button
              type="button"
              onClick={() => setRideType("SCHEDULE")}
              className={`

                rounded-full

                px-3

                py-1.5

                text-xs

                font-semibold

                transition

                ${
                  rideType === "SCHEDULE"
                    ? "bg-blue-600 text-white"
                    : "text-neutral-600"
                }

              `}
            >
              Schedule
            </button>
          </div>
        </header>

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

          {/* DESTINATION CONTROLS */}

          <div
            className="

              mt-2

              flex

              items-center

              justify-between

            "
          >
            {/* ADD STOP */}

            <button
              type="button"
              onClick={handleAddStop}
              title="Add stop"
              aria-label="Add stop"
              className="

                flex

                h-9

                w-9

                items-center

                justify-center

                rounded-full

                border

                border-neutral-200

                bg-white

                text-neutral-600

                shadow-sm

                transition

                hover:border-blue-300

                hover:text-blue-600

              "
            >
              <Plus size={18} />
            </button>

            {/* ONE WAY / ROUND TRIP */}

            <div
              className="

                flex

                items-center

                gap-1

              "
            >
              <button
                type="button"
                onClick={() => setTripMode("ONE_WAY")}
                title="One way"
                aria-label="One way"
                className={`

                  flex

                  h-9

                  w-9

                  items-center

                  justify-center

                  rounded-full

                  border

                  transition

                  ${
                    tripMode === "ONE_WAY"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-neutral-200 bg-white text-neutral-500"
                  }

                `}
              >
                <Route size={17} />
              </button>

              <button
                type="button"
                onClick={() => setTripMode("ROUND_TRIP")}
                title="Round trip"
                aria-label="Round trip"
                className={`

                  flex

                  h-9

                  w-9

                  items-center

                  justify-center

                  rounded-full

                  border

                  transition

                  ${
                    tripMode === "ROUND_TRIP"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-neutral-200 bg-white text-neutral-500"
                  }

                `}
              >
                <Repeat2 size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================

            VALIDATION MESSAGE

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

        {/* =====================================================

            VEHICLE FILTER

        ===================================================== */}

        <section
          className="

            page-section

          "
        >
          <div
            className="

              mb-2

              flex

              items-center

              justify-between

            "
          >
            <p
              className="

                section-description

                text-xs

                font-medium

                text-neutral-600

              "
            >
              Select a vehicle that suits your trip
            </p>
          </div>

          <div
            className="

              flex

              gap-2

              overflow-x-auto

              pb-1

              [scrollbar-width:none]

              [-ms-overflow-style:none]

              [&::-webkit-scrollbar]:hidden

            "
          >
            {/* ALL */}

            <FilterButton
              active={activeVehicle === "All"}
              label="All"
              icon="🚕"
              onClick={() => handleVehicleChange("All")}
            />

            {/* MY */}

            <FilterButton
              active={activeVehicle === homeVehicleType}
              label={`My${
                homeVehicleType && homeVehicleType !== "All"
                  ? ` • ${myVehicleLabel}`
                  : ""
              }`}
              icon="🚗"
              onClick={() => handleVehicleChange(homeVehicleType)}
            />

            {/* FAVORITE */}

            <FilterButton
              active={activeVehicle === "Favorite"}
              label="Favorite"
              icon="★"
              onClick={() => handleVehicleChange("Favorite")}
            />
          </div>
        </section>

        {/* =====================================================

            DRIVER LIST

        ===================================================== */}

        <section
          className="

            page-section

          "
        >
          {/* NO PICKUP */}

          {!pickupLocation && (
            <div
              className="

                rounded-2xl

                border

                border-neutral-200

                bg-white

                px-4

                py-5

                text-center

              "
            >
              <p
                className="

                  text-sm

                  font-semibold

                  text-neutral-800

                "
              >
                Enter pickup location
              </p>

              <p
                className="

                  mt-1

                  text-xs

                  text-neutral-500

                "
              >
                Nearby drivers will appear here.
              </p>
            </div>
          )}

          {/* FAVORITES */}

          {canShowDrivers && activeVehicle === "Favorite" && (
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

          {/* NORMAL DRIVER LIST */}

          {canShowDrivers && activeVehicle !== "Favorite" && (
            <DriverList
              serviceType={serviceType}
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

        py-2.5

        text-sm

        font-medium

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

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
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
