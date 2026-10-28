export default function DriverInfo({
  driver,
  vehicle,
}) {
  const vehicleType =
    vehicle?.vehicleType ||
    vehicle?.type ||
    "";

  const vehicleName =
    vehicle?.vehicleName ||
    vehicle?.name ||
    vehicleType ||
    "Vehicle";

  const vehicleImage =
    vehicle?.imageUrl ||
    vehicle?.image ||
    vehicle?.photoUrl ||
    "";

  return (
    <div className="rounded-[18px] border border-neutral-200 bg-white p-3">
      <p className="mb-2 text-[12px] leading-4 text-neutral-500">
        Driver
      </p>

      <div className="flex items-center gap-3">
        {/* Vehicle image */}
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-neutral-50
          "
        >
          {vehicleImage ? (
            <img
              src={vehicleImage}
              alt={vehicleName}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-2xl">
              🚕
            </span>
          )}
        </div>

        {/* Driver details */}
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold leading-5 text-neutral-900">
            {driver?.businessName ||
              driver?.fullName ||
              driver?.name ||
              "Driver"}
          </h2>

          <p className="mt-0.5 text-[13px] leading-5 text-neutral-500">
            {vehicleName}
          </p>

          <p className="text-[12px] leading-4 text-neutral-500">
            {vehicle?.seats ?? "--"} Seats
            <span className="mx-1.5">•</span>
            {vehicleType || "Vehicle"}
            {vehicle?.registrationNumber && (
              <>
                <span className="mx-1.5">•</span>
                {vehicle.registrationNumber}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}