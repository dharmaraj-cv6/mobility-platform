import { useEffect, useRef, useState } from "react";

import { MapPin, Navigation, LoaderCircle } from "lucide-react";

function formatCompactAddress(address = {}) {
  const street =
    address.road ||
    address.pedestrian ||
    address.residential ||
    address.street ||
    "";

  const area =
    address.suburb ||
    address.neighbourhood ||
    address.quarter ||
    address.village ||
    address.town ||
    "";

  // Include a second locality (for example, Ganapathy) when the
  // geocoder supplies one distinct from the primary area.
  const secondaryArea =
    address.suburb &&
    address.neighbourhood &&
    address.suburb.toLowerCase() !== address.neighbourhood.toLowerCase()
      ? address.neighbourhood
      : address.suburb &&
          address.quarter &&
          address.suburb.toLowerCase() !== address.quarter.toLowerCase()
        ? address.quarter
        : "";

  const city =
    address.city ||
    address.city_district ||
    address.municipality ||
    address.county ||
    "";

  const postcode = address.postcode || "";

  const parts = [street, area, secondaryArea, city, postcode]
    .map((part) => String(part || "").trim())
    .filter(Boolean);

  return parts
    .filter(
      (part, index) =>
        parts.findIndex(
          (candidate) => candidate.toLowerCase() === part.toLowerCase(),
        ) === index,
    )
    .join(", ");
}

export default function LocationCard({
  pickupLocation,

  destination,

  onPickupChange,

  onDestinationChange,
}) {
  const [pickupText, setPickupText] = useState(pickupLocation?.name || "");

  const [destinationText, setDestinationText] = useState(destination || "");

  const [pickupSuggestions, setPickupSuggestions] = useState([]);

  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [pickupLoading, setPickupLoading] = useState(false);

  const [destinationLoading, setDestinationLoading] = useState(false);

  const [pickupLocationError, setPickupLocationError] = useState("");
  const pickupTimer = useRef(null);

  const destinationTimer = useRef(null);

  // =====================================================

  // SYNC

  // =====================================================

  useEffect(() => {
    if (pickupLocation?.name) {
      setPickupText(pickupLocation.name);
    }
  }, [pickupLocation?.name]);

  useEffect(() => {
    setDestinationText(destination || "");
  }, [destination]);

  // =====================================================

  // SEARCH

  // =====================================================

  const searchLocation = async (
    value,

    setSuggestions,

    setLoading,
  ) => {
    const searchText = value.trim();

    if (searchText.length < 3) {
      setSuggestions([]);

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=json" +
        "&addressdetails=1" +
        "&limit=8" +
        "&countrycodes=in" +
        `&q=${encodeURIComponent(`${searchText}, Tamil Nadu, India`)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const result = await response.json();

      const filtered = Array.isArray(result)
        ? result.filter((place) => {
            const address = place?.address || {};

            const country = String(address?.country || "").toLowerCase();

            const state = String(address?.state || "").toLowerCase();

            return (
              country.includes("india") &&
              (state.includes("tamil nadu") || state.includes("tamilnadu"))
            );
          })
        : [];

      setSuggestions(filtered);
    } catch (error) {
      console.error(
        "LOCATION SEARCH ERROR:",

        error,
      );

      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================

  // PICKUP INPUT

  // =====================================================

  const handlePickupInput = (event) => {
    const value = event.target.value;

    setPickupText(value);

    clearTimeout(pickupTimer.current);

    pickupTimer.current = setTimeout(() => {
      searchLocation(
        value,

        setPickupSuggestions,

        setPickupLoading,
      );
    }, 400);
  };

  // =====================================================

  // DESTINATION INPUT

  // =====================================================

  const handleDestinationInput = (event) => {
    const value = event.target.value;

    setDestinationText(value);

    clearTimeout(destinationTimer.current);

    destinationTimer.current = setTimeout(() => {
      searchLocation(
        value,

        setDestinationSuggestions,

        setDestinationLoading,
      );
    }, 400);
  };

  // =====================================================

  // PICKUP SELECT

  // =====================================================

  const selectPickup = (place) => {
    const latitude = Number(place?.lat);

    const longitude = Number(place?.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    const name = place?.display_name || "Pickup Location";

    setPickupText(name);

    setPickupSuggestions([]);

    onPickupChange({
      latitude,

      longitude,

      accuracy: null,

      name,
    });
  };

  // =====================================================

  // DESTINATION SELECT

  // =====================================================

  const selectDestination = (place) => {
    const latitude = Number(place?.lat);

    const longitude = Number(place?.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    const name = place?.display_name || "Destination";

    setDestinationText(name);

    setDestinationSuggestions([]);

    onDestinationChange(
      name,

      {
        latitude,

        longitude,

        name,
      },
    );
  };

  // =====================================================

  // CURRENT LOCATION

  // =====================================================

  const useCurrentLocation = () => {
    setPickupLocationError("");

    if (!navigator.geolocation) {
      setPickupLocationError(
        "Current location is not supported by this browser.",
      );
      return;
    }

    let bestPosition = null;
    let finished = false;

    const finish = async (position) => {
      if (finished || !position) {
        return;
      }

      finished = true;

      const latitude = Number(position.coords.latitude);
      const longitude = Number(position.coords.longitude);
      const accuracy = Number(position.coords.accuracy);

      console.log("CURRENT GPS BEST RESULT:", {
        latitude,
        longitude,
        accuracy,
      });

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        !Number.isFinite(accuracy)
      ) {
        setPickupLocationError("Unable to read your current location.");
        return;
      }

      // Do not send a coarse desktop/IP location to the nearby-driver API.
      if (accuracy > 1000) {
        console.warn("GPS LOCATION TOO INACCURATE:", accuracy);

        setPickupLocationError(
          "Windows is returning only an approximate location. Set your Windows default location to Coimbatore, keep Location Services on, then try Current again.",
        );
        return;
      }

      let name = "Current Location";

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (response.ok) {
          const result = await response.json();
          const address = result?.address || {};

          name = formatCompactAddress(address) || "Current Location";
        }
      } catch (error) {
        console.error("CURRENT LOCATION REVERSE GEOCODE ERROR:", error);
      }

      console.log("CURRENT GPS LOCATION:", {
        latitude,
        longitude,
        accuracy,
        name,
      });

      setPickupLocationError("");
      setPickupText(name);
      setPickupSuggestions([]);

      // Exact coordinates are the source of truth for nearby drivers.
      onPickupChange({
        latitude,
        longitude,
        accuracy,
        name,
        source: "CURRENT_GPS",
      });
    };

    const acceptPosition = (position) => {
      const accuracy = Number(position?.coords?.accuracy);

      if (!Number.isFinite(accuracy)) {
        return;
      }

      console.log("GPS POSITION CANDIDATE:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy,
      });

      if (!bestPosition || accuracy < Number(bestPosition.coords.accuracy)) {
        bestPosition = position;
      }

      // Stop immediately once we have a useful taxi-level location.
      if (accuracy <= 1000) {
        finish(position);
      }
    };

    // watchPosition gives Chrome/Windows several opportunities to
    // replace an IP/coarse result with a Wi-Fi/device location.
    const watchId = navigator.geolocation.watchPosition(
      acceptPosition,
      (error) => {
        console.error("CURRENT LOCATION WATCH ERROR:", {
          code: error?.code,
          message: error?.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );

    // Also request a fresh one-shot reading.
    navigator.geolocation.getCurrentPosition(
      acceptPosition,
      (error) => {
        console.error("CURRENT LOCATION GPS ERROR:", {
          code: error?.code,
          message: error?.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );

    // Give Windows/Chrome up to 20 seconds to improve the result.
    window.setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);

      if (!finished) {
        if (bestPosition) {
          finish(bestPosition);
        } else {
          setPickupLocationError(
            "Unable to get your current location. Please enable Windows Location Services and allow location access for localhost in Chrome.",
          );
        }
      }
    }, 20000);
  };

  return (
    <div
      className="

        relative

        rounded-[24px]

        border

        border-gray-200

        bg-white

        px-4

        py-3

        shadow-sm

      "
    >
      {/* PICKUP */}

      <div className="relative">
        <label
          className="

            block

            text-[12px]

            font-medium

            text-gray-500

          "
        >
          Pickup
        </label>

        <div
          className="

            mt-1

            flex

            items-center

            gap-2

          "
        >
          <MapPin size={17} strokeWidth={2} className="text-gray-700" />

          <input
            value={pickupText}
            onChange={handlePickupInput}
            placeholder="Enter pickup location"
            className="

              min-w-0

              flex-1

              border-0

              bg-transparent

              p-0

              text-[14px]

              text-gray-900

              outline-none

              placeholder:text-gray-400

            "
          />

          <button
            type="button"
            onClick={useCurrentLocation}
            className="

              shrink-0

              text-[12px]

              font-medium

              text-blue-600

            "
          >
            Current
          </button>
        </div>

        {pickupLocationError && (
          <p
            className="
              mt-2
              rounded-lg
              bg-amber-50
              px-2
              py-1.5
              text-[11px]
              font-medium
              text-amber-700
            "
            role="alert"
          >
            {pickupLocationError}
          </p>
        )}

        {pickupLoading && (
          <LoaderCircle
            className="

              absolute

              right-16

              top-6

              animate-spin

              text-blue-500

            "
            size={15}
          />
        )}

        {pickupSuggestions.length > 0 && (
          <SuggestionList
            suggestions={pickupSuggestions}
            onSelect={selectPickup}
          />
        )}
      </div>

      <div
        className="

          my-3

          border-t

          border-gray-200

        "
      />

      {/* DESTINATION */}

      <div className="relative">
        <label
          className="

            block

            text-[12px]

            font-medium

            text-gray-500

          "
        >
          Destination
        </label>

        <div
          className="

            mt-1

            flex

            items-center

            gap-2

          "
        >
          <Navigation size={17} strokeWidth={2} className="text-gray-700" />

          <input
            value={destinationText}
            onChange={handleDestinationInput}
            placeholder="Where do you want to go?"
            className="

              min-w-0

              flex-1

              border-0

              bg-transparent

              p-0

              text-[14px]

              text-gray-900

              outline-none

              placeholder:text-gray-400

            "
          />
        </div>

        {destinationLoading && (
          <LoaderCircle
            className="

              absolute

              right-2

              top-6

              animate-spin

              text-blue-500

            "
            size={15}
          />
        )}

        {destinationSuggestions.length > 0 && (
          <SuggestionList
            suggestions={destinationSuggestions}
            onSelect={selectDestination}
          />
        )}
      </div>
    </div>
  );
}

function SuggestionList({
  suggestions,

  onSelect,
}) {
  return (
    <div
      className="

        absolute

        left-0

        right-0

        top-full

        z-50

        mt-2

        overflow-hidden

        rounded-2xl

        border

        border-gray-200

        bg-white

        shadow-xl

      "
    >
      {suggestions.map((place) => (
        <button
          key={`${place.place_id}-${place.lat}-${place.lon}`}
          type="button"
          onClick={() => onSelect(place)}
          className="

              flex

              w-full

              items-start

              gap-2

              border-b

              border-gray-100

              px-4

              py-3

              text-left

              text-[13px]

              text-gray-700

              last:border-b-0

              hover:bg-gray-50

            "
        >
          <MapPin
            size={16}
            className="

                mt-0.5

                shrink-0

                text-gray-500

              "
          />

          <span>{place.display_name}</span>
        </button>
      ))}
    </div>
  );
}
