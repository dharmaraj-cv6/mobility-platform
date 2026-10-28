export default function VehicleCategories({
  activeZone,
  activeVehicle,
  onVehicleChange,
  activeMenu,
}) {
  if (!activeZone) return null;

  const vehicles = activeZone.vehicles || [];

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
          Select Vehicle Type
        </h3>

        <span className="text-sm font-semibold text-blue-600">
          {vehicles.length} options
        </span>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* VEHICLE OPTIONS */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {vehicles.map((vehicle) => {
            const selected = activeVehicle === vehicle;

            return (
              <button
                key={vehicle}
                type="button"
                aria-pressed={selected}
                onClick={() => onVehicleChange(vehicle)}
                className={`
                  flex min-h-[100px] flex-col items-center
                  justify-center rounded-xl border-2
                  px-3 py-4 text-center transition-all
                  ${
                    selected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }
                `}
              >
                <VehicleIcon vehicle={vehicle} selected={selected} />

                <span
                  className={`
                    mt-2 text-sm font-bold sm:text-base
                    ${selected ? "text-blue-700" : "text-slate-800"}
                  `}
                >
                  {vehicle}
                </span>

                {selected && (
                  <span className="mt-1 text-xs font-semibold text-blue-600">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* USE THE EMPTY SPACE */}

        <aside className="flex flex-col justify-between rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Your selection
            </p>

            <h4 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {activeVehicle || "Choose a vehicle"}
            </h4>

            <p className="mt-2 text-sm font-medium text-slate-600">
              {activeZone.title}
            </p>

            {activeMenu && (
              <p className="mt-1 text-sm text-slate-500">{activeMenu}</p>
            )}
          </div>

          <div className="mt-6 border-t border-blue-100 pt-4">
            <p className="text-sm font-semibold text-slate-800">
              Ready to find your ride?
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              View eligible drivers and their fares on the next page.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function VehicleIcon({ vehicle, selected }) {
  const name = String(vehicle).toLowerCase();

  const isTruck =
    name.includes("truck") || name.includes("cargo") || name.includes("lcv");

  const isBus = name.includes("bus") || name.includes("school");

  const isBike = name.includes("bike");

  const accent = selected ? "#2563eb" : "#3b82f6";

  return (
    <svg
      viewBox="0 0 64 40"
      width="48"
      height="32"
      fill="none"
      aria-hidden="true"
    >
      {isBike ? (
        <>
          <circle cx="14" cy="29" r="7" stroke="#172554" strokeWidth="2.5" />
          <circle cx="50" cy="29" r="7" stroke="#172554" strokeWidth="2.5" />
          <path
            d="M14 29 L25 15 L35 29 L24 29 L20 20 L44 20 L50 29"
            stroke="#172554"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M25 15 H34 L39 20" stroke={accent} strokeWidth="4" />
        </>
      ) : (
        <>
          {isTruck ? (
            <>
              <rect x="4" y="7" width="34" height="24" rx="3" fill={accent} />
              <path
                d="M38 16 H49 L59 25 V31 H38 Z"
                fill="#dbeafe"
                stroke="#172554"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </>
          ) : isBus ? (
            <>
              <rect
                x="6"
                y="5"
                width="52"
                height="27"
                rx="5"
                fill="#dbeafe"
                stroke="#172554"
                strokeWidth="2"
              />
              <path d="M10 21 H54" stroke={accent} strokeWidth="5" />
              {[12, 24, 36, 48].map((x) => (
                <rect
                  key={x}
                  x={x}
                  y="9"
                  width="8"
                  height="8"
                  rx="1"
                  fill={accent}
                />
              ))}
            </>
          ) : (
            <>
              <path
                d="M5 25 L12 17 L19 9 H43 L51 18 L58 23 L59 31 H5 Z"
                fill="#dbeafe"
                stroke="#172554"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M20 12 H30 V20 H14 Z"
                fill="white"
                stroke="#172554"
                strokeWidth="1.5"
              />
              <path d="M33 12 H42 L49 20 H33 Z" fill={accent} />
              <path d="M6 25 H58" stroke={accent} strokeWidth="4" />
            </>
          )}

          <circle cx="17" cy="31" r="5" fill="#172554" />
          <circle cx="47" cy="31" r="5" fill="#172554" />
          <circle cx="17" cy="31" r="2" fill="white" />
          <circle cx="47" cy="31" r="2" fill="white" />
        </>
      )}
    </svg>
  );
}
