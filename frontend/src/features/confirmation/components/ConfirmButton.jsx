import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DRIVER_UNAVAILABLE_MESSAGE =
  "This driver is no longer available. Please choose another available driver.";

export default function ConfirmButton({
  driver,
  vehicle,
  pickupLocation,
  destination,
  destinationLocation,
  tripDistance,
  tripDuration,
  fare,
  serviceType = "CITYRIDES",
  rideType = "RIDE_NOW",
  vehicleType = "All",
  onConfirmed,
  buttonLabel = "Confirm Booking",
}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [driverUnavailable, setDriverUnavailable] = useState(false);

  const handleConfirm = async () => {
    if (loading || driverUnavailable) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }
    if (!driver) {
      setError("Driver information is missing.");
      return;
    }
    if (
      !pickupLocation ||
      pickupLocation.latitude == null ||
      pickupLocation.longitude == null
    ) {
      setError("Pickup location is missing.");
      return;
    }
    if (
      !destination ||
      !destinationLocation ||
      destinationLocation.latitude == null ||
      destinationLocation.longitude == null
    ) {
      setError("Destination location is missing.");
      return;
    }

    const driverProfileId = Number(driver?.driverProfileId ?? driver?.driverId);
    if (!Number.isSafeInteger(driverProfileId) || driverProfileId <= 0) {
      setError("Driver profile ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          driverProfileId,
          driverId: driver?.driverId ?? null,
          serviceType,
          rideType,
          vehicleType,
          pickupLocation,
          pickupAddress: pickupLocation?.name || pickupLocation?.address || "",
          pickupLatitude: Number(pickupLocation.latitude),
          pickupLongitude: Number(pickupLocation.longitude),
          destination,
          destinationLocation,
          dropAddress: destination,
          dropLatitude: Number(destinationLocation.latitude),
          dropLongitude: Number(destinationLocation.longitude),
          estimatedDistance: Number(tripDistance || 0),
          estimatedDuration: Number(tripDuration || 0),
          estimatedFare: fare == null ? null : Number(fare),
        }),
      });

      const responseText = await response.text();
      let result = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Backend returned an invalid booking response.");
      }

      console.log("CREATE BOOKING STATUS:", response.status);
      console.log("CREATE BOOKING RESPONSE:", result);

      if (!response.ok) {
        const errorCode =
          result?.code ?? result?.errorCode ?? result?.error?.code ?? "";
        const errorMessage = result?.message ?? result?.error?.message ?? "";

        // Only hide confirmation when the backend explicitly reports
        // that the driver has become unavailable. Lock expiry alone
        // must not hide the button.
        const unavailableCodes = [
          "DRIVER_ALREADY_BOOKED",
          "DRIVER_UNAVAILABLE",
          "DRIVER_HAS_ACTIVE_BOOKING",
        ];
        const explicitlyUnavailable =
          unavailableCodes.includes(errorCode) ||
          (response.status === 409 &&
            /driver.*(already booked|no longer available|unavailable|active booking)|(already booked|no longer available|unavailable).*driver/i.test(
              errorMessage,
            ));

        if (explicitlyUnavailable) {
          setDriverUnavailable(true);
          setError(DRIVER_UNAVAILABLE_MESSAGE);
          return;
        }

        throw new Error(
          errorMessage || "Unable to create booking. Please try again.",
        );
      }

      const booking = result?.data || result?.booking || result;
      const bookingId = booking?.id ?? booking?.bookingId ?? null;
      if (!bookingId) {
        throw new Error("Booking was created but booking ID was not returned.");
      }

      if (typeof onConfirmed === "function") onConfirmed();

      window.dispatchEvent(
        new CustomEvent("booking-confirmed", {
          detail: { bookingId },
        }),
      );

      navigate("/booking/success", {
        replace: true,
        state: {
          booking,
          bookingId,
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
        },
      });
    } catch (error) {
      console.error("CONFIRM BOOKING ERROR:", error);
      setError(
        error instanceof Error ? error.message : "Unable to confirm booking.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBooking = () => navigate(-1);

  if (driverUnavailable) {
    return (
      <div className="w-full space-y-3">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center"
        >
          <p className="text-sm font-semibold text-red-600">
            This driver is no longer available.
          </p>
          <p className="mt-1 text-xs text-red-600">
            Please choose another available driver to continue your booking.
          </p>
        </div>
        <button
          type="button"
          onClick={handleBackToBooking}
          className="h-[46px] w-full rounded-[12px] border border-gray-300 bg-white text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back to Booking
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div
          role="alert"
          className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-600"
        >
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className="h-[46px] w-full rounded-[12px] bg-blue-600 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-50"
      >
        {loading ? "Confirming..." : buttonLabel}
      </button>
    </div>
  );
}
