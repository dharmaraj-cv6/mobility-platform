import {
  Car,
  Fuel,
  Users,
  Crown,
  UserPlus,
  Phone,
  BadgeCheck,
  CalendarDays,
  ShieldCheck,
  Pencil,
} from "lucide-react";

export default function VehicleDriverProfileCard({
  vehicle = {},
  driver = {},
  onAssignDriver,
  onEditBusiness,
}) {
  const businessName =
    driver?.businessName ||
    driver?.fullName ||
    "Business";

  const vehicleName =
    vehicle?.modelName ||
    vehicle?.name ||
    "Toyota Camry";

  const registrationNumber =
    vehicle?.registrationNumber ||
    "TN 37 AB 1234";

  const driverName =
    driver?.fullName ||
    "Ramesh Kumar";

  const phone =
    driver?.phone ||
    "88888 88888";

  const licenceNumber =
    driver?.licenceNumber ||
    "TN09 2026001234";

  const dob =
    driver?.dob ||
    "15 Mar 1995";

  const permitNumber =
    vehicle?.permitNumber ||
    "CBT-2024-5678";

  const vehicleImage =
    vehicle?.imageUrl ||
    "/images/vehicles/toyota-camry.png";

  const driverImage =
    driver?.profileImage ||
    "/images/driver-placeholder.png";

  const isOwner =
    driver?.isOwner !== false;

  return (
    <section className="w-full">

      {/* =====================================================
          BUSINESS / PAGE HEADER
      ===================================================== */}

      <div className="mb-5 flex items-start justify-between px-1">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h1 className="truncate text-[27px] font-bold tracking-[-0.02em] text-slate-950">
              {businessName}
            </h1>

            <button
              type="button"
              onClick={onEditBusiness}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100"
              aria-label="Edit business name"
            >
              <Pencil
                size={18}
                strokeWidth={2}
              />
            </button>

          </div>

          <p className="mt-0.5 text-[16px] font-medium text-slate-500">
            Driver Profile
          </p>

        </div>

      </div>


      {/* =====================================================
          MAIN HORIZONTAL CARD
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[26px]
          border border-blue-100
          bg-white
          shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        "
      >

        <div className="grid min-h-[370px] grid-cols-[1.12fr_1fr]">

          {/* =================================================
              LEFT — VEHICLE
          ================================================= */}

          <div
            className="
              relative
              flex
              min-w-0
              flex-col
              justify-center
              overflow-hidden
              border-r
              border-blue-100
              px-8
              py-7
              lg:px-11
            "
          >

            {/* Soft road / city background */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-60
              "
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.82) 48%, rgba(239,246,255,0.45) 100%), url('/images/vehicle-road-bg.jpg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />

            <div className="relative z-10 flex h-full flex-col">

              {/* Owner badge */}

              <div className="mb-2 flex items-start justify-between">

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-emerald-600
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                  "
                >
                  <Crown
                    size={18}
                    fill="currentColor"
                    strokeWidth={1.8}
                  />

                  {isOwner
                    ? "Owner"
                    : "Assigned Vehicle"}
                </div>

              </div>


              {/* Vehicle image */}

              <div className="relative flex flex-1 items-center justify-center">

                <div
                  className="
                    pointer-events-none
                    absolute
                    h-[260px]
                    w-[440px]
                    rounded-full
                    bg-blue-50/80
                    blur-3xl
                  "
                />

                <img
                  src={vehicleImage}
                  alt={vehicleName}
                  className="
                    relative
                    z-10
                    max-h-[235px]
                    w-[82%]
                    max-w-[520px]
                    object-contain
                    drop-shadow-[0_18px_18px_rgba(15,23,42,0.12)]
                  "
                />

              </div>


              {/* Vehicle information */}

              <div className="mt-1">

                <h2
                  className="
                    text-[25px]
                    font-bold
                    leading-tight
                    tracking-[-0.02em]
                    text-slate-950
                  "
                >
                  {vehicleName}
                </h2>

                <p className="mt-1 text-[18px] font-semibold text-slate-700">
                  {registrationNumber}
                </p>


                {/* Vehicle chips */}

                <div className="mt-4 flex flex-wrap items-center gap-2">

                  <VehicleChip
                    icon={<Car size={17} />}
                    text={
                      vehicle?.vehicleType ||
                      "Sedan"
                    }
                  />

                  <VehicleChip
                    icon={<Fuel size={17} />}
                    text={
                      vehicle?.fuelType ||
                      "Petrol"
                    }
                  />

                  <VehicleChip
                    icon={<Users size={17} />}
                    text={`${vehicle?.seatingCapacity || 4} Seater`}
                  />

                </div>

              </div>

            </div>
          </div>


          {/* =================================================
              RIGHT — DRIVER
          ================================================= */}

          <div
            className="
              flex
              min-w-0
              flex-col
              justify-center
              px-8
              py-7
              lg:px-10
            "
          >

            {/* Driver top section */}

            <div className="flex items-start gap-6">

              {/* Portrait */}

              <div
                className="
                  relative
                  h-[190px]
                  w-[178px]
                  shrink-0
                  overflow-hidden
                  rounded-[18px]
                  bg-blue-50
                  shadow-[0_8px_22px_rgba(37,99,235,0.10)]
                "
              >

                <img
                  src={driverImage}
                  alt={driverName}
                  className="h-full w-full object-cover"
                />

                {/* Online indicator */}

                <span
                  className="
                    absolute
                    bottom-3
                    right-3
                    h-7
                    w-7
                    rounded-full
                    border-[4px]
                    border-white
                    bg-emerald-500
                  "
                />

              </div>


              {/* Driver summary */}

              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Driver
                    </p>

                    <h2
                      className="
                        truncate
                        text-[26px]
                        font-bold
                        leading-tight
                        tracking-[-0.02em]
                        text-slate-950
                      "
                    >
                      {driverName}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-[17px] font-medium text-slate-700">

                      <Phone
                        size={18}
                        strokeWidth={2}
                      />

                      {phone}

                    </div>

                  </div>


                  {/* Assign */}

                  <button
                    type="button"
                    onClick={onAssignDriver}
                    className="
                      inline-flex
                      shrink-0
                      items-center
                      gap-2
                      rounded-xl
                      bg-blue-50
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-blue-600
                      transition
                      hover:bg-blue-100
                    "
                  >

                    <UserPlus
                      size={18}
                      strokeWidth={2}
                    />

                    Assign Driver

                  </button>

                </div>


                {/* Assignment status */}

                <div
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-blue-50
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-600
                  "
                >
                  <BadgeCheck
                    size={17}
                  />

                  {isOwner
                    ? "Owner Driver"
                    : "Assigned Driver"}
                </div>

              </div>

            </div>


            {/* =================================================
                DRIVER DETAILS
            ================================================= */}

            <div className="mt-7 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-6">

              <DriverDetail
                icon={<BadgeCheck size={25} />}
                label="Licence No."
                value={licenceNumber}
              />

              <DriverDetail
                icon={<CalendarDays size={25} />}
                label="DOB"
                value={dob}
                extra={
                  driver?.age
                    ? `(${driver.age} years)`
                    : undefined
                }
              />

              <DriverDetail
                icon={<ShieldCheck size={25} />}
                label="Permit No."
                value={permitNumber}
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


/* ============================================================
   VEHICLE CHIP
============================================================ */

function VehicleChip({
  icon,
  text,
}) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-blue-50
        px-4
        py-2
        text-sm
        font-semibold
        text-slate-700
      "
    >
      <span className="text-blue-600">
        {icon}
      </span>

      {text}
    </span>
  );
}


/* ============================================================
   DRIVER DETAIL
============================================================ */

function DriverDetail({
  icon,
  label,
  value,
  extra,
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 px-5 first:pl-0 last:pr-0">

      <div className="mt-0.5 shrink-0 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-sm font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-[16px] font-bold text-slate-800">
          {value}
        </p>

        {extra && (
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            {extra}
          </p>
        )}

      </div>

    </div>
  );
}