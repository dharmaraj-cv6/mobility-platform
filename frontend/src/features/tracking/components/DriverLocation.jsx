import { CarFront, MapPin } from "lucide-react";

export default function DriverLocation({
  driver,
  vehicle,
  distance,
}) {
  const businessName =
    driver?.businessName ||
    driver?.user?.businessName ||
    driver?.user?.fullName ||
    "Driver";

  const vehicleModel =
    vehicle?.model ||
    vehicle?.brand ||
    vehicle?.vehicleModel ||
    "Vehicle";

  const vehicleType =
    vehicle?.vehicleType || "";

  const registrationNumber =
    vehicle?.registrationNumber ||
    vehicle?.registrationNo ||
    vehicle?.numberPlate ||
    vehicle?.plateNumber ||
    "--";

  const vehicleLabel =
    vehicleType
      ? vehicleType
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          )
      : "Vehicle";

  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-4">
      <div className="flex items-center">
        {/* Vehicle */}
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-neutral-50">
          <CarFront
            size={24}
            strokeWidth={1.7}
            className="text-neutral-600"
          />
        </div>

        {/* Driver details */}
        <div className="min-w-0 flex-1 pl-3">
          <h2 className="truncate text-[15px] font-semibold leading-[18px] text-neutral-900">
            {businessName}
          </h2>

          <p className="mt-[2px] truncate text-[12px] leading-4 text-neutral-500">
            {vehicleModel}
          </p>

          <div className="mt-[4px] flex items-center gap-2 text-[11px] leading-[14px] text-neutral-600">
            <span className="flex items-center gap-1">
              <CarFront
                size={12}
                strokeWidth={1.8}
              />

              {registrationNumber}
            </span>

            {distance != null && (
              <>
                <span className="text-neutral-300">
                  •
                </span>

                <span className="flex items-center gap-1">
                  <MapPin
                    size={12}
                    strokeWidth={1.8}
                  />

                  {distance} km away
                </span>
              </>
            )}
          </div>
        </div>

        {/* Vehicle type */}
        <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium leading-3 text-neutral-700">
          {vehicleLabel}
        </span>
      </div>
    </section>
  );
}