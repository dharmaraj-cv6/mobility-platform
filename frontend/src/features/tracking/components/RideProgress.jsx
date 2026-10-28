export default function RideProgress({
  booking,
}) {
  const steps = [
    {
      key: "DRIVER_ACCEPTED",
      label: "Driver accepted",
    },
    {
      key: "DRIVER_STARTED",
      label: "Driver started",
    },
    {
      key: "DRIVER_ARRIVED",
      label: "Driver arrived",
    },
    {
      key: "RIDE_STARTED",
      label: "Ride started",
    },
  ];

  const status =
    booking?.status || "DRIVER_ACCEPTED";

  const statusOrder = {
    DRIVER_ACCEPTED: 0,
    DRIVER_STARTED: 1,
    DRIVER_ARRIVED: 2,
    RIDE_STARTED: 3,
    COMPLETED: 4,
  };

  const currentIndex =
    statusOrder[status] ?? 0;

  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-4">
      {/* Section title */}
      <p className="mb-4 text-[12px] font-medium leading-4 text-neutral-500">
        Ride progress
      </p>

      {/* Desktop */}
      <div className="hidden md:flex">
        {steps.map((step, index) => {
          const completed =
            index < currentIndex;

          const active =
            index === currentIndex;

          const upcoming =
            index > currentIndex;

          return (
            <div
              key={step.key}
              className="flex flex-1 items-start"
            >
              {/* Step */}
              <div className="flex min-w-0 flex-col items-center">
                {/* Circle */}
                <div
                  className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-[11px]
                    font-medium

                    ${
                      completed
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : active
                        ? "border-neutral-900 bg-white text-neutral-900"
                        : "border-neutral-200 bg-neutral-50 text-neutral-400"
                    }
                  `}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                {/* Label */}
                <p
                  className={`
                    mt-2
                    text-center
                    text-[10px]
                    leading-[14px]

                    ${
                      upcoming
                        ? "text-neutral-400"
                        : "font-medium text-neutral-800"
                    }
                  `}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {index <
                steps.length - 1 && (
                <div
                  className={`
                    mt-[13px]
                    h-px
                    flex-1
                    ${
                      index <
                      currentIndex
                        ? "bg-neutral-900"
                        : "bg-neutral-200"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {steps.map((step, index) => {
          const completed =
            index < currentIndex;

          const active =
            index === currentIndex;

          const upcoming =
            index > currentIndex;

          return (
            <div
              key={step.key}
              className="flex"
            >
              {/* Timeline */}
              <div className="flex w-7 flex-col items-center">
                <div
                  className={`
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-[11px]
                    font-medium

                    ${
                      completed
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : active
                        ? "border-neutral-900 bg-white text-neutral-900"
                        : "border-neutral-200 bg-neutral-50 text-neutral-400"
                    }
                  `}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                {index <
                  steps.length - 1 && (
                  <div
                    className={`
                      my-1
                      min-h-[28px]
                      w-px
                      ${
                        index <
                        currentIndex
                          ? "bg-neutral-900"
                          : "bg-neutral-200"
                      }
                    `}
                  />
                )}
              </div>

              {/* Text */}
              <div className="pl-3">
                <p
                  className={`
                    pt-[5px]
                    text-[12px]
                    leading-4

                    ${
                      upcoming
                        ? "text-neutral-400"
                        : "font-medium text-neutral-800"
                    }
                  `}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}