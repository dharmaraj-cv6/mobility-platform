import { useNavigate } from "react-router-dom";

export default function DriverArrival({
  driver,
  vehicle,
  pickupLocation,
  destination,
  destinationLocation,
  tripDistance,
  tripDuration,
  fare,
}) {
  const navigate = useNavigate();

  const driverName =
    driver?.businessName ||
    driver?.user?.fullName ||
    driver?.name ||
    "Driver";

  const vehicleModel =
    vehicle?.model ||
    vehicle?.vehicleType ||
    "Vehicle";

  const vehicleType =
    vehicle?.vehicleType ||
    "Vehicle";

  const seats =
    vehicle?.seatCapacity ??
    "--";

  const vehicleNumber =
    vehicle?.vehicleNumber ||
    "--";

  const handleTrackDriver = () => {
    navigate("/tracking", {
      state: {
        driver,
        vehicle,
        pickupLocation,
        destination,
        destinationLocation,
        tripDistance,
        tripDuration,
        fare,
      },
    });
  };

  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white px-5 py-4 sm:px-6">

      {/* HEADER */}
      <div className="relative text-center">

        <h2 className="text-[20px] font-semibold leading-6 text-neutral-900">
          Driver is heading to pickup
        </h2>

        <p className="mt-0.5 text-[13px] leading-5 text-neutral-500">
          Driver is moving towards your pickup location
        </p>

        {/* ETA */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <p className="text-[16px] font-semibold leading-5 text-neutral-900">
            Arriving in 5 min
          </p>
        </div>

      </div>

      {/* MAIN ARRIVAL AREA */}
      <div className="mt-5 grid grid-cols-[180px_minmax(0,1fr)_100px] items-center gap-5">

        {/* DRIVER */}
        <div>

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
            <span className="text-[30px]">
              🚕
            </span>
          </div>

          <h3 className="mt-2 text-[15px] font-semibold leading-5 text-neutral-900">
            {driverName}
          </h3>          
         <p className="whitespace-nowrap text-[12px] leading-4 text-neutral-500">
          {vehicleType}
          <span className="mx-1.5">•</span>
           {vehicleModel}
          <span className="mx-1.5">•</span>
          {vehicleNumber}
        </p>

        </div>

        {/* PROGRESS */}
        <div className="flex flex-col">

          <div className="flex items-center">

            <div className="h-[3px] w-[55%] rounded-l-full bg-neutral-900" />

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
              <span className="text-[20px]">
                🚗
              </span>
            </div>

            <div className="h-[3px] flex-1 rounded-r-full bg-neutral-200" />

          </div>

          {/* TRACK */}
          <div className="mt-1.5 text-center">
            <button
              type="button"
              onClick={handleTrackDriver}
              className="
                text-[12px]
                font-medium
                text-neutral-700
                underline
                underline-offset-2
                hover:text-neutral-900
              "
            >
              Track Driver
            </button>
          </div>

        </div>

        {/* PICKUP */}
        <div className="flex flex-col items-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
            <span className="text-[28px]">
              📍
            </span>
          </div>

          <p className="mt-2 text-[12px] leading-4 text-neutral-500">
            Pickup
          </p>

        </div>

      </div>

    </section>
  );
}