import {
  useEffect,
  useRef,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import ConfirmButton from "../components/ConfirmButton";
import DriverInfo from "../components/DriverInfo";
import FareSummary from "../components/FareSummary";
import LocationSummary from "../components/LocationSummary";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};

  // ============================================================
  // DRIVER
  // ============================================================

  const driver =
    state.driver ||
    state.selectedDriver ||
    null;

  const vehicle =
    state.vehicle ||
    driver?.vehicle ||
    driver?.Vehicle?.[0] ||
    null;

  // ============================================================
  // LOCATIONS
  // ============================================================

  const pickupLocation =
    state.pickupLocation ||
    state.pickup ||
    null;

  const destination =
    state.destination ||
    state.dropAddress ||
    "";

  const destinationLocation =
    state.destinationLocation ||
    state.drop ||
    state.dropLocation ||
    null;

  // ============================================================
  // TRIP
  // ============================================================

  const tripDistance = Number(
    state.tripDistance ??
      state.distance ??
      state.estimatedDistance ??
      0
  );

  const tripDuration = Number(
    state.tripDuration ??
      state.duration ??
      state.estimatedDuration ??
      state.estimatedTime ??
      0
  );

  // ============================================================
  // FARE
  // ============================================================

  const fare =
    state.fare ??
    driver?.fare ??
    null;

  // Display money with a maximum of two decimal places.
  // Keep the original fare value for the booking flow.
  const displayFare =
    fare !== null &&
    Number.isFinite(Number(fare))
      ? Math.round(Number(fare) * 100) / 100
      : fare;

  // ============================================================
  // RIDE CONFIG
  // ============================================================

  const serviceType =
    state.serviceType ||
    "CITYRIDES";

  const rideType =
    state.rideType ||
    "RIDE_NOW";

  const vehicleType =
    state.vehicleType ||
    "All";

  // ============================================================
  // RESERVATION
  //
  // Reservation remains separate from watcher flow.
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
  // WATCHER SESSION
  //
  // This is separate from:
  // - driver reservation
  // - booking confirmation
  //
  // The watcher contribution remains active until:
  // - the confirmation page is left before booking confirmation, or
  // - the booking acceptance flow clears it after driver acceptance.
  // ============================================================

  const watcherSessionIdsRef =
    useRef([]);

  const bookingConfirmedRef =
    useRef(false);

  const watcherStartedRef =
    useRef(false);

  // ============================================================
  // DRIVER LIST
  // ============================================================

  const nearbyDrivers =
    state.drivers ||
    state.driverList ||
    state.nearbyDrivers ||
    [];

  // ============================================================
  // NORMALIZE DRIVER PROFILE IDS
  // ============================================================

  const driverProfileIds = [
    ...new Set(
      Array.isArray(nearbyDrivers)
        ? nearbyDrivers
            .map(
              (item) =>
                Number(
                  item?.driverProfileId ??
                  item?.driverId ??
                  item?.id
                )
            )
            .filter(
              (id) =>
                Number.isInteger(id) &&
                id > 0
            )
        : []
    ),
  ];

  // ============================================================
  // START WATCHER
  //
  // Runs once when ConfirmationPage becomes active.
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const startWatcher = async () => {
      if (
        watcherStartedRef.current ||
        driverProfileIds.length === 0
      ) {
        return;
      }

      const token =
        localStorage.getItem(
          "auth_token"
        );

      if (!token) {
        console.warn(
          "WATCHER: authentication token missing."
        );

        return;
      }

      try {
        watcherStartedRef.current =
          true;

        const response =
          await fetch(
            `${API_URL}/watcheralert/start`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                driverProfileIds,
                serviceType,
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to start watcher."
          );
        }

        if (cancelled) {
          return;
        }

        watcherSessionIdsRef.current =
          Array.isArray(
            result?.data?.sessionIds
          )
            ? result.data.sessionIds
            : [];

        console.log(
          "WATCHER STARTED:",
          result
        );
      } catch (error) {
        watcherStartedRef.current =
          false;

        console.error(
          "WATCHER START ERROR:",
          error
        );
      }
    };

    startWatcher();

    return () => {
      cancelled = true;

      /*
       * If the booking has already been confirmed,
       * keep the watcher contribution alive.
       */
      if (
        bookingConfirmedRef.current
      ) {
        return;
      }

      const token =
        localStorage.getItem(
          "auth_token"
        );

      if (!token) {
        return;
      }

      const sessionIds =
        watcherSessionIdsRef.current;

      fetch(
        `${API_URL}/watcheralert/stop`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            sessionIds,
          }),

          keepalive: true,
        }
      ).catch(
        (error) => {
          console.error(
            "WATCHER STOP ERROR:",
            error
          );
        }
      );

      watcherSessionIdsRef.current =
        [];
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // REQUIRED DATA
  // ============================================================

  if (
    !driver ||
    !pickupLocation ||
    !destination ||
    !destinationLocation
  ) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-8">
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

            <p className="mt-2 text-sm leading-5 text-neutral-500">
              Please select your pickup,
              destination and driver again.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/booking",
                  {
                    replace: true,
                  }
                )
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
                active:scale-[0.99]
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

  const handleChooseAnother =
    () => {
      navigate(
        "/booking",
        {
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
          },
        }
      );
    };

  // ============================================================
  // CONFIRMATION
  //
  // ConfirmButton creates the actual booking.
  //
  // Watcher contribution remains active after confirmation
  // until the driver acceptance process clears it.
  // ============================================================

  const handleBookingConfirmed =
    () => {
      bookingConfirmedRef.current =
        true;
    };

  // ============================================================
  // UI
  //
  // IMPORTANT:
  // Only presentation/layout is changed here.
  // Booking, watcher, navigation and data logic remain unchanged.
  // ============================================================

  return (
    <main className="min-h-screen bg-neutral-50">
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          px-4
          py-5
          sm:px-6
          sm:py-7
          lg:px-8
          lg:py-8
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-5 sm:mb-6">
          <h1
            className="
              text-[22px]
              font-semibold
              leading-7
              tracking-[-0.01em]
              text-neutral-900
              sm:text-[24px]
              sm:leading-8
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
              sm:text-sm
            "
          >
            Review your ride details before confirming
          </p>
        </header>

   

        {/* =====================================================
            DRIVER
        ===================================================== */}

        <section
          aria-label="Selected driver"
          className="mb-4"
        >
          <DriverInfo
            driver={driver}
            vehicle={vehicle}
          />
        </section>

        {/* =====================================================
            TRIP DETAILS
        ===================================================== */}

        <section
          aria-label="Trip details"
          className="mb-4"
        >
          <LocationSummary
            pickupLocation={
              pickupLocation
            }
            destination={
              destination
            }
            destinationLocation={
              destinationLocation
            }
          />
        </section>

        {/* =====================================================
            FARE SUMMARY
        ===================================================== */}

        <section
          aria-label="Fare summary"
          className="mb-5"
        >
          <FareSummary
            baseFare={displayFare}
            distance={tripDistance}
            duration={tripDuration}
            totalFare={displayFare}
          />
        </section>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-md
            gap-3
            pb-2
          "
        >
          <button
            type="button"
            onClick={
              handleChooseAnother
            }
            className="
              h-[46px]
              flex-1
              rounded-xl
              border
              border-neutral-300
              bg-white
              px-3
              text-[13px]
              font-medium
              text-neutral-700
              shadow-sm
              transition
              hover:bg-neutral-50
              hover:border-neutral-400
              active:scale-[0.99]
            "
          >
            Choose Another
          </button>

          <div className="min-w-0 flex-1">
            <ConfirmButton
              driver={driver}
              vehicle={vehicle}
              pickupLocation={
                pickupLocation
              }
              destination={
                destination
              }
              destinationLocation={
                destinationLocation
              }
              tripDistance={
                tripDistance
              }
              tripDuration={
                tripDuration
              }
              fare={fare}
              serviceType={
                serviceType
              }
              rideType={
                rideType
              }
              vehicleType={
                vehicleType
              }
              onConfirmed={
                handleBookingConfirmed
              }
              reservationExpiresAt={
                reservationExpiresAt
              }
              reservationStatus={
                reservationStatus
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
