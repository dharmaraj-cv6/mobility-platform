import {
  Moon,
  Save,
  Sun,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

// =====================================================
// COMMON FARE SETTING FORM
//
// mode:
// driver   = Driver's own fare
// app      = App Controlled / Master fare
// internal = Internal Team / inherited fare
// =====================================================

export default function FareSettingForm({
  service,
  fare,
  mode = "driver",
  readOnly = false,
  onSave,
  onClose,
  saveLabel,
}) {
  const [minimumFare, setMinimumFare] =
    useState(
      fare?.dayFare?.minimumFare ?? 0
    );

  const [perKm, setPerKm] =
    useState(
      fare?.dayFare?.perKm ?? 0
    );

  const [nightAdjustment, setNightAdjustment] =
    useState(
      fare?.nightFare?.adjustment ?? 0
    );


  // ===================================================
  // SYNC
  // ===================================================

  useEffect(() => {
    if (!onClose) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  useEffect(() => {
    setMinimumFare(
      fare?.dayFare?.minimumFare ?? 0
    );

    setPerKm(
      fare?.dayFare?.perKm ?? 0
    );

    setNightAdjustment(
      fare?.nightFare?.adjustment ?? 0
    );
  }, [fare]);


  // ===================================================
  // NUMBERS
  // ===================================================

  const minimum =
    Number(minimumFare) || 0;

  const kilometerFare =
    Number(perKm) || 0;

  const nightPercentage =
    Number(nightAdjustment) || 0;


  // ===================================================
  // PREVIEW
  // ===================================================

  const dayOneKm =
    minimum + kilometerFare;

  const nightOneKm =
    dayOneKm +
    (dayOneKm *
      nightPercentage) /
      100;


  // ===================================================
  // MODE
  // ===================================================

  const modeTitles = {
    driver: "DRIVER FARE",
    app: "APP CONTROLLED FARE",
    internal: "INTERNAL TEAM FARE",
  };


  // ===================================================
  // SAVE
  // ===================================================

  const handleSave = () => {
    if (readOnly) {
      return;
    }

    const updatedFare = {
      dayFare: {
        minimumFare: minimum,
        perKm: kilometerFare,
      },

      nightFare: {
        adjustment: nightPercentage,
      },
    };

    onSave?.(updatedFare);
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 sm:p-5">

      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between border-b border-slate-200 p-5">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {modeTitles[mode] || "FARE SETTINGS"}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {service?.title || "Fare Settings"}
            </h2>

            {service?.description && (
              <p className="mt-1 text-sm text-slate-500">
                {service.description}
              </p>
            )}

          </div>


          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close fare settings"
              title="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <X size={18} />
            </button>
          )}

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="overflow-y-auto bg-slate-50 p-5">

          <div className="grid gap-5 xl:grid-cols-2">


            {/* =================================================
                DAY
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

              <div className="border-b border-slate-100 bg-amber-50/40 p-5">

                <div className="flex items-center gap-2">

                  <Sun
                    size={18}
                    className="text-amber-600"
                  />

                  <div>

                    <h3 className="text-base font-bold text-slate-900">
                      Day Fare
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Standard fare during daytime.
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <FareInput
                  label="Minimum Fare"
                  value={minimumFare}
                  disabled={readOnly}
                  onChange={setMinimumFare}
                />

                <FareInput
                  label="Per KM"
                  value={perKm}
                  disabled={readOnly}
                  onChange={setPerKm}
                />


                <div className="mt-6 rounded-xl bg-slate-50 p-4">

                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    1 KM Day Fare
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    ₹{dayOneKm.toFixed(2)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    ₹{minimum.toFixed(2)}
                    {" + "}
                    ₹{kilometerFare.toFixed(2)}
                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
                NIGHT
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

              <div className="border-b border-slate-100 bg-blue-50/40 p-5">

                <div className="flex items-center gap-2">

                  <Moon
                    size={18}
                    className="text-blue-600"
                  />

                  <div>

                    <h3 className="text-base font-bold text-slate-900">
                      Night Fare
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Additional fare during night hours.
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5">

                <div>

                  <div className="flex items-center justify-between">

                    <label className="text-xs font-semibold text-slate-500">
                      Night Adjustment
                    </label>

                    <span className="text-lg font-bold text-blue-600">
                      {nightPercentage}%
                    </span>

                  </div>


                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={nightPercentage}
                    disabled={readOnly}
                    onChange={(event) =>
                      setNightAdjustment(
                        event.target.value
                      )
                    }
                    className="mt-5 w-full accent-blue-600"
                  />


                  <div className="mt-2 flex justify-between text-[10px] text-slate-400">

                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>

                  </div>

                </div>


                <div className="mt-6">

                  <label className="text-xs font-semibold text-slate-500">
                    Night Adjustment %
                  </label>

                  <div className="relative mt-2">

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nightAdjustment}
                      disabled={readOnly}
                      onChange={(event) =>
                        setNightAdjustment(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      %
                    </span>

                  </div>

                </div>


                <div className="mt-6 rounded-xl bg-slate-50 p-4">

                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    1 KM Night Fare
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    ₹{nightOneKm.toFixed(2)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Day fare + {nightPercentage}%
                  </p>

                </div>

              </div>

            </section>

          </div>


          {/* =================================================
              CALCULATION
          ================================================= */}

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

            <h3 className="text-sm font-bold text-slate-900">
              Fare Calculation
            </h3>

            <div className="mt-4 grid gap-3 md:grid-cols-3">

              <FormulaItem
                title="Minimum Fare"
                value={`₹${minimum.toFixed(2)}`}
              />

              <FormulaItem
                title="Per KM"
                value={`₹${kilometerFare.toFixed(2)}`}
              />

              <FormulaItem
                title="Night Adjustment"
                value={`${nightPercentage}%`}
              />

            </div>

          </section>


          {/* =================================================
              NOTE
          ================================================= */}

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

            <p className="text-xs leading-5 text-slate-500">

              <strong className="text-slate-700">
                Example:
              </strong>

              {" "}

              ₹{minimum.toFixed(2)}
              {" minimum + "}
              ₹{kilometerFare.toFixed(2)}
              {" per KM = "}
              ₹{dayOneKm.toFixed(2)}
              {" for 1 KM during day."}

              {" "}

              Night adjustment of{" "}
              {nightPercentage}%
              {" gives "}
              ₹{nightOneKm.toFixed(2)}.

            </p>

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-white p-5">

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}


          {!readOnly && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >

              <Save size={15} />

              {saveLabel ||
                (mode === "driver"
                  ? "Save & Go to My Services"
                  : "Save Fare")}

            </button>
          )}

        </div>

      </div>

    </div>
  );
}


// =====================================================
// INPUT
// =====================================================

function FareInput({
  label,
  value,
  disabled,
  onChange,
}) {
  return (
    <label className="mt-5 block first:mt-0">

      <span className="text-xs font-semibold text-slate-500">
        {label}
      </span>

      <div className="relative mt-2">

        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          ₹
        </span>

        <input
          type="number"
          min="0"
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-3 text-sm font-semibold outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400"
        />

      </div>

    </label>
  );
}


// =====================================================
// FORMULA ITEM
// =====================================================

function FormulaItem({
  title,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-base font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}