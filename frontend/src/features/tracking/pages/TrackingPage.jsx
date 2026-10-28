import TrackingMap from "../components/TrackingMap";

const RIDE_STAGES = [
  {
    key: "DRIVER_TO_PICKUP",
    title: "Driver coming to pickup",
    description: "Track your driver as they travel to your pickup point.",
    aliases: ["DRIVER_TO_PICKUP", "EN_ROUTE_TO_PICKUP", "PICKUP_STARTED"],
  },
  {
    key: "AT_PICKUP",
    title: "Arrived at pickup",
    description: "Your driver has arrived at the pickup point.",
    aliases: ["AT_PICKUP", "ARRIVED_AT_PICKUP", "DRIVER_ARRIVED"],
  },
  {
    key: "RIDE_STARTED",
    title: "Trip started",
    description: "Your ride is in progress.",
    aliases: ["RIDE_STARTED", "TRIP_STARTED", "IN_PROGRESS"],
  },
  {
    key: "DESTINATION_REACHED",
    title: "Destination reached",
    description: "Your driver has reached the destination.",
    aliases: ["DESTINATION_REACHED", "ARRIVED_AT_DESTINATION", "RIDE_ENDED"],
  },
  {
    key: "COMPLETED",
    title: "Ride completed",
    description: "This ride has been completed.",
    aliases: ["COMPLETED", "RIDE_COMPLETED"],
  },
];

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[ -]+/g, "_");
}

function getCurrentStageIndex(booking) {
  const possibleStatuses = [
    booking?.status,
    booking?.bookingStatus,
    booking?.rideStatus,
    booking?.tripStatus,
  ]
    .map(normalizeStatus)
    .filter(Boolean);

  for (let index = RIDE_STAGES.length - 1; index >= 0; index -= 1) {
    if (
      RIDE_STAGES[index].aliases.some((alias) =>
        possibleStatuses.includes(alias),
      )
    ) {
      return index;
    }
  }

  return -1;
}

export default function TrackingPage({ booking, driver }) {
  const currentStageIndex = getCurrentStageIndex(booking);
  const isCompleted = currentStageIndex === RIDE_STAGES.length - 1;

  const driverName =
    driver?.businessName ||
    driver?.business ||
    driver?.user?.fullName ||
    driver?.name ||
    "Your driver";

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
            OwnTrip live tracking
          </p>

          <h1 className="mt-1 text-[22px] font-semibold leading-7 text-neutral-900">
            Track your ride
          </h1>

          <p className="mt-1 text-[13px] leading-5 text-neutral-500">
            Follow your driver and ride progress in one tracking session.
          </p>
        </header>

        {/* Driver / status summary */}
        <section className="mb-4 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-2xl">
            🚘
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {driverName}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {currentStageIndex < 0
                ? "Waiting for ride status"
                : RIDE_STAGES[currentStageIndex].title}
            </p>
          </div>

          {booking?.id != null || booking?.bookingId != null ? (
            <div className="text-right">
              <p className="text-[11px] text-neutral-500">Booking</p>
              <p className="text-sm font-semibold text-neutral-900">
                #{booking?.bookingId ?? booking?.id}
              </p>
            </div>
          ) : null}
        </section>

        {/* Live Map — keep the existing map and its session logic */}
        <section className="overflow-hidden rounded-[18px] border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-neutral-900">
              Live location
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              The map uses your existing TrackingMap component.
            </p>
          </div>

          <TrackingMap booking={booking} driver={driver} />
        </section>

        {/* Ride progress */}
        <section className="mt-4 rounded-[18px] border border-neutral-200 bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-neutral-900">
              Ride progress
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Progress updates as the driver changes the ride status.
            </p>
          </div>

          <ol className="space-y-0">
            {RIDE_STAGES.map((stage, index) => {
              const isCurrent = index === currentStageIndex;
              const isDone =
                currentStageIndex >= 0 && index < currentStageIndex;

              return (
                <li key={stage.key} className="flex gap-3">
                  <div className="flex w-6 shrink-0 flex-col items-center">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                        isDone
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isCurrent
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-neutral-300 bg-white text-neutral-400"
                      }`}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isDone ? "✓" : index + 1}
                    </span>

                    {index < RIDE_STAGES.length - 1 && (
                      <span
                        className={`my-1 min-h-7 w-px flex-1 ${
                          isDone ? "bg-emerald-500" : "bg-neutral-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="pb-5">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent || isDone
                          ? "text-neutral-900"
                          : "text-neutral-500"
                      }`}
                    >
                      {stage.title}
                      {isCurrent && (
                        <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          Current
                        </span>
                      )}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {stage.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {isCompleted && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800">
              This ride is completed.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
