import { useNavigate } from "react-router-dom";
import vehicles from "../data/vehicles";

export default function DriverList({
  activeZone,
  activeMenu,
  activeVehicle,
}) {
  const navigate = useNavigate();

  const filteredVehicles =
    activeVehicle === "All"
      ? vehicles
      : vehicles.filter(
          (vehicle) =>
            vehicle.vehicle === activeVehicle
        );

  const driver = filteredVehicles[0];

  if (!driver) {
    return (
      <section className="mt-5">
        <p className="text-sm font-semibold text-neutral-900">
          Nearby Driver
        </p>
      </section>
    );
  }

  const handleDriverClick = () => {
    navigate("/booking", {
      state: {
        service: activeZone?.id || "city",
        rideType: activeMenu || "bookNow",
        vehicle: driver.vehicle,
        suggestedDriver: driver,
        entry: "suggested-driver",
      },
    });
  };

  return (
    <section className="mt-5">

      <div className="mb-3">
        <h3 className="text-sm text-neutral-900">
          Nearby Driver
        </h3>
      </div>


      {/* CLICKABLE DRIVER CARD */}

      <button
        type="button"
        onClick={handleDriverClick}
        className="
          group
          block
          w-full
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-4
          text-left
          shadow-sm
          transition
          hover:border-[var(--primary)]
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--primary)]
          focus:ring-offset-2
        "
      >

        <div className="flex items-center gap-3">

          {/* Driver Avatar */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-neutral-100
              text-lg
            "
          >
            👤
          </div>


          {/* Driver Information */}

          <div className="min-w-0 flex-1">

            <div className="flex items-center justify-between gap-3">

              <div>

                <h4 className="text-sm font-semibold text-neutral-900">
                  {driver.driver}
                </h4>

                <p className="mt-0.5 text-xs text-neutral-500">
                  {driver.business}
                </p>

              </div>


              <span
                className="
                  shrink-0
                  rounded-lg
                  bg-neutral-100
                  px-2
                  py-1
                  text-[11px]
                  font-medium
                  text-neutral-700
                "
              >
                {driver.vehicle}
              </span>

            </div>


            <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">

              <span>
                📍 {driver.distance}
              </span>

              <span>
                •
              </span>

              <span>
                🕐 {driver.eta}
              </span>

            </div>

          </div>


          {/* Fare */}

          <div className="shrink-0 text-right">

            <p className="text-[10px] text-neutral-400">
              Est. fare
            </p>

            <p className="text-lg font-bold text-neutral-900">
              ₹{driver.fare}
            </p>

          </div>

        </div>


       
      </button>

    </section>
  );
}