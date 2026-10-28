const VEHICLE_TYPES = {
  BIKE: "Bike",
  AUTO: "Auto",
  CAB_5: "Cab - 5 Seater",
  CAB_7: "Cab - 7 Seater",
  CAB_9: "Cab - 9 Seater",
  CARGO: "Cargo",
  MINI_BUS: "Mini Bus",
  BUS: "Bus",
};

export default function VehicleCard({
  vehicle,
  onEdit,
  onFareSettings,
}) {
  const isApproved =
    vehicle.status === "APPROVED";

  const isPending =
    vehicle.status === "PENDING";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-4">

          {/* Vehicle Image */}

          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">

            {vehicle.image ? (
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl">
                🚗
              </span>
            )}

          </div>

          {/* Name */}

          <div className="min-w-0">

            <h2 className="truncate text-lg font-bold text-slate-900">
              {vehicle.name}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {vehicle.registrationNumber}
            </p>

          </div>

        </div>


        {/* Status */}

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            isApproved
              ? "bg-green-100 text-green-700"
              : isPending
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {vehicle.status}
        </span>

      </div>


      {/* ================= DETAILS ================= */}

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div>
          <p className="text-xs text-slate-400">
            Vehicle Type
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {VEHICLE_TYPES[
              vehicle.type
            ] || vehicle.type || "-"}
          </p>
        </div>


        <div>
          <p className="text-xs text-slate-400">
            Model
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {vehicle.model || "-"}
          </p>
        </div>


        <div>
          <p className="text-xs text-slate-400">
            Year
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {vehicle.year || "-"}
          </p>
        </div>


        <div>
          <p className="text-xs text-slate-400">
            Seating
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {vehicle.seatingCapacity ||
              "-"}
          </p>
        </div>


        <div>
          <p className="text-xs text-slate-400">
            Colour
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {vehicle.colour || "-"}
          </p>
        </div>

      </div>


      {/* ================= PENDING ================= */}

      {isPending && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

          <p className="text-sm font-semibold text-amber-800">
            Vehicle verification in progress
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            This vehicle can be used for business
            services after approval.
          </p>

        </div>
      )}


      {/* ================= REJECTED ================= */}

      {vehicle.status === "REJECTED" && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm font-semibold text-red-800">
            Vehicle verification rejected
          </p>

          {vehicle.rejectionReason && (
            <p className="mt-1 text-xs leading-5 text-red-700">
              {vehicle.rejectionReason}
            </p>
          )}

        </div>
      )}


      {/* ================= ACTIONS ================= */}

      <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">

        <button
          type="button"
          onClick={() => onEdit(vehicle)}
          className="h-11 flex-1 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Edit
        </button>


        {isApproved && (
          <button
            type="button"
            onClick={() =>
              onFareSettings(vehicle)
            }
            className="h-11 flex-1 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Fare Settings
          </button>
        )}

      </div>

    </div>
  );
}