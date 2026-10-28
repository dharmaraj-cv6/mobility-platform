import {
  Car,
  MapPin,
} from "lucide-react";

export default function TrackingMap({
  driver,
  pickupLocation,
}) {
  const driverLat =
    driver?.availability?.currentLatitude;

  const driverLng =
    driver?.availability?.currentLongitude;

  const pickupLat =
    pickupLocation?.latitude;

  const pickupLng =
    pickupLocation?.longitude;

  return (
    <div
      className="
        relative
        h-[320px]
        w-full
        overflow-hidden
        rounded-[18px]
        border
        border-neutral-200
        bg-neutral-100
      "
    >
      {/* Map background */}
      <div
        className="
          absolute
          inset-0
          bg-neutral-100
        "
      >
        {/* Simple map grid */}
        <div
          className="
            absolute
            inset-0
            opacity-40
            [background-image:linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)]
            [background-size:40px_40px]
          "
        />

        {/* Roads */}
        <div
          className="
            absolute
            left-[-10%]
            top-[48%]
            h-[22px]
            w-[120%]
            rotate-[-12deg]
            bg-white
            shadow-sm
          "
        />

        <div
          className="
            absolute
            left-[38%]
            top-[-20%]
            h-[140%]
            w-[18px]
            rotate-[24deg]
            bg-white
            shadow-sm
          "
        />

        <div
          className="
            absolute
            left-[-10%]
            top-[28%]
            h-[12px]
            w-[120%]
            rotate-[8deg]
            bg-white
          "
        />
      </div>

      {/* Pickup marker */}
      <div
        className="
          absolute
          left-[24%]
          top-[62%]
          z-20
          flex
          h-9
          w-9
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white
          bg-white
          shadow-md
        "
        title={
          pickupLat && pickupLng
            ? `${pickupLat}, ${pickupLng}`
            : "Pickup"
        }
      >
        <MapPin
          size={18}
          strokeWidth={2}
          className="text-neutral-800"
        />
      </div>

      {/* Driver marker */}
      <div
        className="
          absolute
          left-[62%]
          top-[38%]
          z-20
          flex
          h-10
          w-10
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white
          bg-neutral-900
          shadow-md
        "
        title={
          driverLat && driverLng
            ? `${driverLat}, ${driverLng}`
            : "Driver"
        }
      >
        <Car
          size={18}
          strokeWidth={2}
          className="text-white"
        />
      </div>

      {/* Driver status */}
      <div
        className="
          absolute
          left-3
          top-3
          z-30
          rounded-[12px]
          border
          border-neutral-200
          bg-white
          px-3
          py-2
          shadow-sm
        "
      >
        <p className="text-[10px] font-medium leading-3 text-neutral-500">
          Driver location
        </p>

        <p className="mt-[2px] text-[12px] font-semibold leading-4 text-neutral-900">
          Live
        </p>
      </div>

      {/* Coordinates are intentionally not displayed.
          They are only used as live-data props. */}
    </div>
  );
}