import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import ConfirmButton from "../components/ConfirmButton";
import DriverInfo from "../components/DriverInfo";
import FareSummary from "../components/FareSummary";
import LocationSummary from "../components/LocationSummary";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const WATCHER_DURATION_MS = 60 * 1000;

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};

  // ============================================================
  // DRIVER
  // ============================================================

  const driver = state.driver || state.selectedDriver || null;

  const vehicle =
    state.vehicle || driver?.vehicle || driver?.Vehicle?.[0] || null;

  // ============================================================
  // LOCATIONS
  // ============================================================

  const pickupLocation = state.pickupLocation || state.pickup || null;

  const destination = state.destination || state.dropAddress || "";

  const destinationLocation =
    state.destinationLocation || state.drop || state.dropLocation || null;

  // ============================================================
  // TRIP
  // ============================================================

  const tripDistance = Number(
    state.tripDistance ?? state.distance ?? state.estimatedDistance ?? 0,
  );

  const tripDuration = Number(
    state.tripDuration ??
      state.duration ??
      state.estimatedDuration ??
      state.estimatedTime ??
      0,
  );

  // ============================================================
  // FARE
  // ============================================================

  const rawFare = state.fare ?? driver?.fare ?? 0;

  const numericFare = Number(rawFare);

  const fare = Number.isFinite(numericFare)
    ? Number(numericFare.toFixed(2))
    : 0;

  // ============================================================
  // RIDE CONFIG
  // ============================================================

  const serviceType = state.serviceType || "CITYRIDES";

  const rideType = state.rideType || "RIDE_NOW";

  const vehicleType = state.vehicleType || "All";

  // ============================================================
  // DRIVER RESERVATION
  //
  // COMPLETELY SEPARATE FROM WATCHER FLOW.
  // ============================================================

  const reservationExpiresAt =
    state.reservationExpiresAt ||
    state.reservation?.reservationExpiresAt ||
    null;

  const reservationStatus =
    state.reservationStatus ||
    state.reservation?.reservationStatus ||
    "RESERVED";

  // ============================================================
  // NEARBY DRIVER LIST
  //
  // IMPORTANT:
  //
  // Watcher contribution belongs to EVERY driver that was
  // displayed in this passenger's nearby-driver list.
  //
  // It is NOT only the selected driver.
  //
  // We support the common state names so this remains compatible
  // with the existing booking flow.
  // ============================================================

  const nearbyDrivers =
    state.nearbyDrivers ||
    state.drivers ||
    state.driverList ||
    state.nearbyDriverList ||
    [];

  // ============================================================
  // WATCHER SESSION
  // ============================================================

  const watcherSessionIdsRef = useRef([]);

  const watcherStartedRef = useRef(false);

  const watcherStoppedRef = useRef(false);

  const bookingConfirmedRef = useRef(false);

  // ============================================================
  // PAGE EXPIRY
  // ============================================================

  const SESSION_DURATION_MS = WATCHER_DURATION_MS;

  const [pageExpired, setPageExpired] = useState(false);

  // ============================================================
  // SESSION START
  // ============================================================

  const getSessionStartTime = () => {
    const reservationStartedAt =
      state.reservationStartedAt ||
      state.reservation?.reservationStartedAt ||
      null;

    if (reservationStartedAt) {
      const timestamp = new Date(reservationStartedAt).getTime();

      if (Number.isFinite(timestamp)) {
        return timestamp;
      }
    }

    return Date.now();
  };

  // ============================================================
  // EXTRACT DRIVER PROFILE IDS
  // ============================================================

  const getDriverProfileId = (item) => {
    // IMPORTANT:
    // Do NOT fall back to item.id or driver.id.
    // Watchers require DriverProfile.id.
    const id =
      item?.driverProfileId ??
      item?.driver?.driverProfileId ??
      item?.DriverProfile?.id;

    const numericId = Number(id);

    return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
  };

  const getNearbyDriverProfileIds = () => {
    const ids = [];

    for (const item of nearbyDrivers) {
      const id = getDriverProfileId(item);

      if (id) {
        ids.push(id);
      }
    }

    // Make absolutely sure the selected driver
    // is included if the booking state contains it.
    const selectedDriverId = getDriverProfileId(driver);

    if (selectedDriverId) {
      ids.push(selectedDriverId);
    }

    return [...new Set(ids)];
  };

  // ============================================================
  // START WATCHER
  //
  // This starts when Confirmation Page becomes active.
  //
  // Reservation is NOT touched.
  // Booking is NOT created.
  // ConfirmButton is NOT touched here.
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const startWatcher = async () => {
      if (watcherStartedRef.current || watcherStoppedRef.current) {
        return;
      }

      const token = localStorage.getItem("auth_token");

      if (!token) {
        console.warn("WATCHER: authentication token missing.");

        return;
      }

      const driverProfileIds = getNearbyDriverProfileIds();

      if (driverProfileIds.length === 0) {
        console.warn("WATCHER: no nearby driver IDs found.");

        return;
      }

      try {
        watcherStartedRef.current = true;

        const response = await fetch(`${API_URL}/watcheralert/start`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            driverProfileIds,

            serviceType,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Unable to start watcher.");
        }

        if (cancelled) {
          return;
        }

        watcherSessionIdsRef.current = Array.isArray(result?.data?.sessionIds)
          ? result.data.sessionIds
          : [];

        console.log("WATCHER STARTED:", {
          driverProfileIds,
          serviceType,
          sessionIds: watcherSessionIdsRef.current,
        });
      } catch (error) {
        watcherStartedRef.current = false;

        console.error("WATCHER START ERROR:", error);
      }
    };

    startWatcher();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // STOP WATCHER
  //
  // Used when passenger leaves the confirmation page
  // without confirming the booking.
  //
  // IMPORTANT:
  //
  // If booking was confirmed, DO NOT remove watcher contribution.
  //
  // ConfirmButton will later attach those watcher rows to the
  // created booking.
  // ============================================================

  const stopWatcher = async () => {
    if (watcherStoppedRef.current || bookingConfirmedRef.current) {
      return;
    }

    watcherStoppedRef.current = true;

    const token = localStorage.getItem("auth_token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/watcheralert/stop`, {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          driverProfileIds: getNearbyDriverProfileIds(),
        }),
      });

      const result = await response.json();

      console.log("WATCHER STOPPED:", result);
    } catch (error) {
      console.error("WATCHER STOP ERROR:", error);
    }
  };

  // ============================================================
  // 60 SECOND CONFIRMATION SESSION
  //
  // 0–30:
  //     Driver reservation may be active.
  //
  // 30–60:
  //     Reservation may be expired.
  //     Watcher remains active.
  //
  // 60:
  //     Confirmation page expires.
  //     Watcher contribution is removed.
  // ============================================================

  useEffect(() => {
    const sessionStart = getSessionStartTime();

    const checkExpiry = () => {
      const elapsed = Date.now() - sessionStart;

      if (elapsed >= SESSION_DURATION_MS) {
        setPageExpired(true);

        // The confirmation page has ended.
        // Remove this passenger's watcher contribution.
        stopWatcher();
      }
    };

    checkExpiry();

    const timer = window.setInterval(checkExpiry, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // ============================================================
  // PAGE LEAVE
  //
  // Browser navigation / component unmount.
  //
  // DO NOT stop if booking was confirmed.
  // ============================================================

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!bookingConfirmedRef.current) {
        stopWatcher();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (!bookingConfirmedRef.current) {
        stopWatcher();
      }
    };
  }, []);

  // ============================================================
  // MARK BOOKING CONFIRMED
  //
  // This flag is available for the booking confirmation flow.
  //
  // It prevents the watcher from being removed simply because
  // ConfirmButton navigates away from this page.
  // ============================================================

  useEffect(() => {
    const handleBookingConfirmed = () => {
      bookingConfirmedRef.current = true;
    };

    window.addEventListener("booking-confirmed", handleBookingConfirmed);

    return () => {
      window.removeEventListener("booking-confirmed", handleBookingConfirmed);
    };
  }, []);

  // ============================================================
  // DEBUG
  // ============================================================

  console.log("CONFIRMATION PAGE STATE:", {
    driver,
    vehicle,
    pickupLocation,
    destination,
    destinationLocation,
    tripDistance,
    tripDuration,
    fare,
    serviceType,
    rideType,
    vehicleType,
    reservationExpiresAt,
    reservationStatus,
    nearbyDrivers,
    nearbyDriverProfileIds: getNearbyDriverProfileIds(),
    pageExpired,
  });

  // ============================================================
  // REQUIRED DATA
  // ============================================================

  if (!driver || !pickupLocation || !destination || !destinationLocation) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
          <div
            className="
              w-full
              rounded-2xl
              border
              border-red-200
              bg-white
              p-6
              text-center
              shadow-sm
            "
          >
            <h1 className="text-lg font-semibold text-neutral-900">
              Booking details missing
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Please select your pickup, destination and driver again.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/booking", {
                  replace: true,
                })
              }
              className="
                mt-5
                h-11
                w-full
                rounded-xl
                bg-blue-600
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Back to Booking
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // CHOOSE ANOTHER DRIVER
  // ============================================================

  const handleChooseAnother = async () => {
    await stopWatcher();

    navigate("/booking", {
      replace: true,

      state: {
        serviceType,
        rideType,
        vehicleType,

        pickupLocation,
        destination,
        destinationLocation,

        tripDistance,
        tripDuration,

        nearbyDrivers,
      },
    });
  };

  // ============================================================
  // BACK TO BOOKING FROM EXPIRY
  // ============================================================

  const handleBackToBooking = async () => {
    await stopWatcher();

    navigate("/booking", {
      replace: true,

      state: {
        serviceType,
        rideType,
        vehicleType,

        pickupLocation,
        destination,
        destinationLocation,

        tripDistance,
        tripDuration,

        nearbyDrivers,
      },
    });
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen bg-neutral-50">
      <div
        className="
          mx-auto
          mt-6
          w-full
          max-w-5xl
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-5">
          <h1
            className="
              text-[22px]
              font-semibold
              leading-7
              text-neutral-900
            "
          >
            Confirm your booking details
          </h1>

          <p
            className="
              mt-1
              text-[13px]
              leading-5
              text-neutral-500
            "
          >
            Review your ride details before confirming
          </p>
        </header>

        {/* =====================================================
            DRIVER STATUS
        ===================================================== */}

        <div
          className="
            mb-5
            rounded-2xl
            border
            border-neutral-200
            bg-white
            px-4
            py-3
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                Driver available
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Your booking will be created when you confirm.
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] text-neutral-500">Status</p>

              <p className="text-lg font-semibold text-neutral-900">Ready</p>
            </div>
          </div>
        </div>

        {/* =====================================================
            DRIVER
        ===================================================== */}

        <DriverInfo driver={driver} vehicle={vehicle} />

        {/* =====================================================
            LOCATIONS
        ===================================================== */}

        <LocationSummary
          pickupLocation={pickupLocation}
          destination={destination}
          destinationLocation={destinationLocation}
        />

        {/* =====================================================
            FARE
        ===================================================== */}

        <FareSummary
          baseFare={fare}
          distance={tripDistance}
          duration={tripDuration}
          totalFare={fare}
        />

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div
          className="
            mx-auto
            mt-5
            flex
            w-full
            max-w-md
            gap-3
          "
        >
          {/* ===================================================
              CHOOSE ANOTHER
          =================================================== */}

          <button
            type="button"
            onClick={handleChooseAnother}
            className="
              h-[46px]
              flex-1
              rounded-[12px]
              border
              border-neutral-300
              bg-white
              text-[13px]
              font-medium
              text-neutral-700
              transition
              hover:bg-neutral-50
            "
          >
            Choose Another
          </button>

          {/* ===================================================
              NORMAL BOOKING CONFIRMATION
          =================================================== */}

          <div className="flex-1">
            <ConfirmButton
              driver={driver}
              vehicle={vehicle}
              pickupLocation={pickupLocation}
              destination={destination}
              destinationLocation={destinationLocation}
              tripDistance={tripDistance}
              tripDuration={tripDuration}
              fare={fare}
              serviceType={serviceType}
              rideType={rideType}
              vehicleType={vehicleType}
              reservationExpiresAt={reservationExpiresAt}
              reservationStatus={reservationStatus}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          60 SECOND PAGE EXPIRY MODAL
      ======================================================== */}

      {pageExpired && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-session-expired-title"
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
          >
            <h2
              id="booking-session-expired-title"
              className="
                text-lg
                font-semibold
                text-neutral-900
              "
            >
              Booking session expired
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-neutral-600
              "
            >
              The selected driver's temporary hold has expired and the driver
              has been released.
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-neutral-600
              "
            >
              Please select the driver again or continue with your booking
              confirmation.
            </p>

            <div
              className="
                mt-6
                flex
                gap-3
              "
            >
              {/* ==================================================
                  BACK TO BOOKING
              ================================================== */}

              <button
                type="button"
                onClick={handleBackToBooking}
                className="
                  h-[46px]
                  flex-1
                  rounded-[12px]
                  border
                  border-neutral-300
                  bg-white
                  text-[13px]
                  font-semibold
                  text-neutral-700
                  transition
                  hover:bg-neutral-50
                "
              >
                Back to Booking
              </button>

              {/* ==================================================
                  CONFIRM BOOKING
              ================================================== */}

              <div className="flex-1">
                <ConfirmButton
                  driver={driver}
                  vehicle={vehicle}
                  pickupLocation={pickupLocation}
                  destination={destination}
                  destinationLocation={destinationLocation}
                  tripDistance={tripDistance}
                  tripDuration={tripDuration}
                  fare={fare}
                  serviceType={serviceType}
                  rideType={rideType}
                  vehicleType={vehicleType}
                  reservationExpiresAt={reservationExpiresAt}
                  reservationStatus={reservationStatus}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
