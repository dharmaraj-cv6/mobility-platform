import { useEffect, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import ConfirmButton from "../components/ConfirmButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const fare = state.fare ?? driver?.fare ?? null;

  // ============================================================

  // RIDE CONFIG

  // ============================================================

  const serviceType = state.serviceType || "CITYRIDES";

  const rideType = state.rideType || "RIDE_NOW";

  const vehicleType = state.vehicleType || "All";

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

  const watcherSessionIdsRef = useRef([]);

  const bookingConfirmedRef = useRef(false);

  const watcherStartedRef = useRef(false);

  // ============================================================

  // DRIVER LIST

  // ============================================================

  const nearbyDrivers =
    state.drivers || state.driverList || state.nearbyDrivers || [];

  // ============================================================

  // NORMALIZE DRIVER PROFILE IDS

  // ============================================================

  const driverProfileIds = [
    ...new Set(
      Array.isArray(nearbyDrivers)
        ? nearbyDrivers

            .map((item) =>
              Number(item?.driverProfileId ?? item?.driverId ?? item?.id),
            )

            .filter((id) => Number.isInteger(id) && id > 0)
        : [],
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
      if (watcherStartedRef.current || driverProfileIds.length === 0) {
        return;
      }

      const token = localStorage.getItem("auth_token");

      if (!token) {
        console.warn("WATCHER: authentication token missing.");

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

        console.log("WATCHER STARTED:", result);
      } catch (error) {
        watcherStartedRef.current = false;

        console.error("WATCHER START ERROR:", error);
      }
    };

    startWatcher();

    return () => {
      cancelled = true;

      /*

       * If the booking has already been confirmed,

       * keep the watcher contribution alive.

       */

      if (bookingConfirmedRef.current) {
        return;
      }

      const token = localStorage.getItem("auth_token");

      if (!token) {
        return;
      }

      const sessionIds = watcherSessionIdsRef.current;

      fetch(`${API_URL}/watcheralert/stop`, {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          sessionIds,
        }),

        keepalive: true,
      }).catch((error) => {
        console.error("WATCHER STOP ERROR:", error);
      });

      watcherSessionIdsRef.current = [];
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================

  // REQUIRED DATA

  // ============================================================

  if (!driver || !pickupLocation || !destination || !destinationLocation) {
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

  const handleChooseAnother = () => {
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
      },
    });
  };

  // Cancel before the booking is created and return to the same booking flow.

  // The temporary reservation remains protected by the backend expiry window.

  const handleCancelBooking = () => {
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

        cancelled: true,
      },
    });
  };

  // ============================================================

  // CONFIRMATION

  //

  // ConfirmButton creates the actual booking.

  //

  // Watcher contribution remains active after confirmation

  // until the driver acceptance process clears it.

  // ============================================================

  const handleBookingConfirmed = () => {
    bookingConfirmedRef.current = true;
  };

  // ============================================================

  // UI — GoSago compact confirmation design

  // Keeps the existing watcher and booking confirmation logic.

  // ============================================================

  const businessName =
    driver?.businessName ||
    driver?.companyName ||
    driver?.business?.name ||
    driver?.ownerName ||
    driver?.name ||
    driver?.driverName ||
    "Covai Selvi Auto";

  const driverName =
    driver?.driverName ||
    driver?.name ||
    driver?.fullName ||
    driver?.user?.name ||
    "Covai Selvi";

  const driverPhoto =
    driver?.photoUrl ||
    driver?.profileImage ||
    driver?.profilePhoto ||
    driver?.avatar ||
    driver?.user?.profileImage ||
    "";

  const vehiclePhoto =
    vehicle?.imageUrl ||
    vehicle?.image ||
    vehicle?.photoUrl ||
    vehicle?.vehicleImage ||
    "";

  const rating =
    driver?.rating ?? driver?.averageRating ?? driver?.user?.rating ?? 4.8;

  const experienceYears =
    driver?.experienceYears ??
    driver?.yearsOfExperience ??
    driver?.experience ??
    50;

  const rawOffer =
    driver?.driverOffer ||
    driver?.offer ||
    driver?.offerDetails ||
    state.driverOffer ||
    state.offer ||
    null;

  const discountAmount = Math.max(
    0,

    Number(
      rawOffer?.discountAmount ??
        rawOffer?.discount ??
        rawOffer?.saving ??
        rawOffer?.offerAmount ??
        0,
    ) || 0,
  );

  const numericFare = Math.max(0, Number(fare) || 0);

  const payableAmount = Math.max(0, numericFare - discountAmount);

  const passenger =
    state.passenger || state.passengerDetails || state.user || {};
  const passengerName =
    passenger?.name ||
    passenger?.fullName ||
    state.passengerName ||
    state.customerName ||
    "Not provided";
  const passengerPhone =
    passenger?.phone ||
    passenger?.mobile ||
    passenger?.phoneNumber ||
    state.passengerPhone ||
    state.customerPhone ||
    state.mobileNumber ||
    "Not provided";

  const pickupText =
    pickupLocation?.name ||
    pickupLocation?.address ||
    pickupLocation?.formattedAddress ||
    "Pickup location";

  const destinationText =
    destinationLocation?.name ||
    destinationLocation?.address ||
    destination ||
    "Destination";

  const money = (amount) =>
    `₹${Math.round(Number(amount) || 0).toLocaleString("en-IN")}`;

  return (
    <main className="min-h-screen bg-[#f1f3f7] px-1.5 py-1.5 text-[#18223b]">
      <div className="mx-auto w-full max-w-[390px] overflow-hidden">
        {/* Business details — first, matching reference image 1 */}
        <section className="mb-1.5 rounded-t-[3px] bg-white px-2.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d9e2f4] bg-white text-[17px]">
                {driver?.businessLogo ||
                driver?.logoUrl ||
                driver?.companyLogo ||
                vehiclePhoto ? (
                  <img
                    src={
                      driver?.businessLogo ||
                      driver?.logoUrl ||
                      driver?.companyLogo ||
                      vehiclePhoto
                    }
                    alt={`${businessName} logo`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span aria-hidden="true">🚕</span>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-[15px] font-bold leading-5 text-[#202b42]">
                  {businessName}
                </h1>
                <p className="truncate text-[9px] leading-3 tracking-[0.04em] text-[#3764bb]">
                  {driver?.businessCategory ||
                    driver?.serviceName ||
                    "Service in City Ride"}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-bold leading-5 text-[#202b42]">
                {experienceYears != null &&
                Number.isFinite(Number(experienceYears))
                  ? `${experienceYears} Yrs`
                  : "Verified"}
              </p>
              <p className="text-[9px] leading-3 text-[#3764bb]">Experience</p>
            </div>
          </div>

          {/* Selected driver card — single clean row, without the outer border */}
          <div className="mt-1.5 rounded-[9px] bg-[#293f82] px-2 py-2 text-white">
            <div className="flex min-h-[64px] items-center gap-2">
              <div className="min-w-0 flex-1 self-center">
                <div className="flex min-w-0 items-center gap-1.5">
                  <p className="truncate text-[11px] font-bold leading-[14px]">
                    {driverName}
                  </p>
                  {rating != null && Number.isFinite(Number(rating)) && (
                    <span className="shrink-0 whitespace-nowrap text-[9px] leading-[12px] text-[#d5dced]">
                      ★ {Number(rating).toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="mt-[3px] flex min-w-0 items-center gap-1.5 whitespace-nowrap text-white/95">
                  <span className="flex min-w-0 items-center gap-1 text-[7px] leading-[10px]">
                    <span className="shrink-0 text-[9px] text-[#ffc928]">
                      ♟
                    </span>
                    <span className="truncate">
                      {driver?.businessModelLabel ||
                        driver?.role ||
                        "Owner cum driver"}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[6px] leading-[10px]">
                    <span className="inline-flex h-[10px] w-[10px] shrink-0 items-center justify-center rounded-[3px] bg-[#ffc928] font-bold text-[#293f82]">
                      ✓
                    </span>
                    <span className="font-semibold">Police VERIFIED</span>
                  </span>
                </div>
              </div>

              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden bg-white/15 text-xxl">
                {driverPhoto ? (
                  <img
                    src={driverPhoto}
                    alt={driverName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true">👤</span>
                )}
              </div>
              <div className="flex h-[56px] w-[35px] shrink-0 flex-col items-center justify-center rounded-[6px] bg-[#ffcc35] text-[#173675]">
                <span className="text-[19px] font-extrabold leading-[20px]">
                  {Number(
                    rawOffer?.discountPercent ??
                      rawOffer?.percentage ??
                      rawOffer?.discountPercentage ??
                      20,
                  )}
                  <sup className="text-[9px]">%</sup>
                </span>
                <span className="text-[8px] font-bold leading-[10px]">
                  Offer
                </span>
              </div>

              <div className="w-[47px] shrink-0 self-center text-center">
                <p className="text-[8px] font-bold leading-[10px]">
                  Women
                  <br />
                  Only
                </p>
                <p className="mt-[2px] text-[6px] leading-[8px] text-white/90">
                  Ride benefits
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking details */}

        <section className="mb-1.5 rounded-[9px] bg-white px-2.5 py-2 shadow-[0_1px_3px_rgba(25,42,76,0.07)]">
          <div className="mb-1.5 flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-[#263f83]">
              Booking Details
            </h2>

            <button
              type="button"
              onClick={handleChooseAnother}
              className="text-[9px] font-semibold text-[#075be8]"
            >
              Edit
            </button>
          </div>

          <div className="space-y-1 rounded-[7px] bg-[#f5f6f8] px-2.5 py-2">
            <div className="flex min-w-0 items-start gap-2">
              <span className="mt-[3px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#13b866]" />

              <p className="line-clamp-2 min-w-0 text-[8px] leading-[12px] text-[#313947]">
                {pickupText}
              </p>
            </div>

            <div className="flex min-w-0 items-start gap-2">
              <span className="mt-[3px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#f04444]" />

              <p className="line-clamp-2 min-w-0 text-[8px] leading-[12px] text-[#313947]">
                {destinationText}
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#edf2ff] px-2 py-1 text-[8px] font-semibold text-[#263f83]">
              {String(serviceType).replaceAll("_", " ")}
            </span>
            <span className="rounded-full bg-[#edf2ff] px-2 py-1 text-[8px] font-semibold text-[#263f83]">
              {String(rideType).replaceAll("_", " ")}
            </span>
            {vehicleType && vehicleType !== "All" && (
              <span className="rounded-full bg-[#edf2ff] px-2 py-1 text-[8px] font-semibold text-[#263f83]">
                {vehicleType}
              </span>
            )}
          </div>
        </section>

        {/* Driver offer */}

        <section className="mb-1.5 flex items-center gap-2 rounded-[9px] bg-[#f0f4ff] px-2.5 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e1ebff] text-[15px]">
            📣
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-[9px] font-bold leading-3 text-[#263f83]">
              {rawOffer?.title || rawOffer?.name || "Driver’s Offer Applied"}
            </h2>

            <p className="line-clamp-1 text-[7px] leading-3 text-[#4b5568]">
              {rawOffer?.description ||
                rawOffer?.label ||
                (discountAmount > 0
                  ? "Offer applied to this ride"
                  : "No additional driver offer")}
            </p>
          </div>

          {discountAmount > 0 && (
            <span className="shrink-0 text-[9px] font-bold text-[#263f83]">
              Save {money(discountAmount)}
            </span>
          )}
        </section>

        {/* Fare summary */}

        <section className="mb-1.5 rounded-[9px] border border-[#e1e5ed] bg-white px-3 py-2.5">
          <h2 className="mb-2 text-[10px] font-bold text-[#333d50]">
            Fare Summary
          </h2>

          <div className="space-y-2 text-[8px] leading-3 text-[#353b46]">
            <div className="flex items-center justify-between gap-3">
              <span>Estimated distance</span>

              <span className="font-medium text-[#303846]">
                {tripDistance > 0
                  ? `${Number(tripDistance).toFixed(1).replace(/\.0$/, "")} km`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span>Base fare</span>

              <span className="font-medium">
                {fare != null ? money(numericFare) : "To be confirmed"}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between gap-3">
                <span>Driver’s Discount</span>

                <span className="font-semibold text-[#202a3b]">
                  − {money(discountAmount)}
                </span>
              </div>
            )}

            <div className="my-1 border-t border-[#edf0f4]" />

            <div className="flex items-center justify-between gap-3 pt-0.5 text-[11px] font-bold text-[#1c2535]">
              <span>Payable amount</span>

              <span>{fare != null ? money(payableAmount) : "Pending"}</span>
            </div>
          </div>
        </section>

        <p className="mb-3 px-5 text-[7px] font-medium text-[#394254]">
          {tripDuration > 0
            ? `Driver arriving in approximately ${Math.round(tripDuration)} minutes`
            : "Driver arrival time will be confirmed after booking"}
        </p>

        {/* Safety strip */}

        <section className="mb-2 flex min-h-[48px] items-center gap-2 border-2 border-[#08a7ff] bg-[#f1f7ff] px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e4f5ec] text-[15px]">
            🛡️
          </div>

          <div className="min-w-0">
            <h2 className="text-[9px] font-bold leading-3 text-[#263f83]">
              Safety Ride, Trusted Driver
            </h2>

            <p className="text-[7px] leading-3 text-[#485367]">
              SOS Available | No Hidden charges
            </p>
          </div>
        </section>

        {/* Keep the existing real booking action */}

        <div className="px-3 pb-2">
          <div className="[&>button]:!h-[38px] [&>button]:!rounded-[8px] [&>button]:!bg-gradient-to-b [&>button]:!from-[#3e55bd] [&>button]:!to-[#172d82] [&>button]:!text-[13px] [&>button]:!font-bold [&>button]:!tracking-[0.08em] [&>button]:!shadow-[0_2px_4px_rgba(20,40,110,0.25)]">
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
              onConfirmed={handleBookingConfirmed}
              buttonLabel="Booking Confirm"
              reservationExpiresAt={reservationExpiresAt}
              reservationStatus={reservationStatus}
            />
          </div>
        </div>

        {/* Secondary cancellation action, aligned with the same compact card layout. */}

        <div className="px-3 pb-3 pt-0.5">
          <button
            type="button"
            onClick={handleCancelBooking}
            className="flex h-[30px] w-full items-center justify-center rounded-[7px] bg-white px-3 text-[10px] font-semibold text-[#23458d] shadow-[0_1px_2px_rgba(20,40,80,0.04)] transition hover:border-[#9eb8ef] hover:bg-[#f6f9ff] active:scale-[0.99]"
          >
            Booking Cancel
          </button>
        </div>

        {/* Passenger contact details — final section after Booking Cancel, as requested. */}
        <section className="mx-3 mb-3 rounded-[9px] border border-[#e1e5ed] bg-white px-3 py-2.5">
          <h2 className="mb-2 text-[10px] font-bold text-[#263f83]">
            Passenger Contact Details
          </h2>
          <div className="space-y-2 text-[9px] text-[#353b46]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#68738a]">Passenger name</span>
              <span className="max-w-[60%] truncate text-right font-semibold">
                {passengerName}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#68738a]">Mobile number</span>
              <span className="max-w-[60%] truncate text-right font-semibold">
                {passengerPhone}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
