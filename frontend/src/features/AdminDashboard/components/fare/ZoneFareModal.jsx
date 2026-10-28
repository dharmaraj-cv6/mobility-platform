import {
  X,
  Save,
  Sun,
  Moon,
  MapPinned,
} from "lucide-react";

import { useState } from "react";

export default function ZoneFareModal({
  zone,
  fareSystem,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState({
      intercity: {
        ...zone.intercity,
      },

      outerCity: {
        ...zone.outerCity,
      },
    });

  const updateFare = (
    service,
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,

      [service]: {
        ...current[service],

        [field]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-200 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">

              <MapPinned
                size={21}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                City Ride
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {zone.name} ·{" "}
                {zone.location}
              </p>

              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">

                {fareSystem ===
                "APP_CONTROLLED"
                  ? "App Controlled Fare"
                  : "Internal Team Fare"}

              </span>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>

        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto bg-slate-50 p-5">

          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Service
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              City Ride
            </p>

            <p className="mt-1 text-xs text-slate-500">
              All local rides and outer rides
            </p>

          </div>

          <div className="grid gap-5 xl:grid-cols-2">

            <FareService
              title="Intercity"
              description="Trips between cities"
              fare={
                form.intercity
              }
              onUpdate={(
                field,
                value
              ) =>
                updateFare(
                  "intercity",
                  field,
                  value
                )
              }
            />

            <FareService
              title="Outer City"
              description="Local and outer city rides"
              fare={
                form.outerCity
              }
              onUpdate={(
                field,
                value
              ) =>
                updateFare(
                  "outerCity",
                  field,
                  value
                )
              }
            />

          </div>

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-2 border-t border-slate-200 p-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              onSave({
                ...zone,

                intercity:
                  form.intercity,

                outerCity:
                  form.outerCity,
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Save size={15} />

            Save Fare
          </button>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// FARE SERVICE
// =====================================================

function FareService({
  title,
  description,
  fare,
  onUpdate,
}) {
  const minimum =
    Number(
      fare.minimumFare
    ) || 0;

  const perKm =
    Number(
      fare.perKm
    ) || 0;

  const night =
    Number(
      fare.nightAdjustment
    ) || 0;

  const dayFare =
    minimum + perKm;

  const nightFare =
    dayFare +
    (dayFare * night) /
      100;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      <div className="border-b border-slate-100 p-5">

        <h3 className="text-base font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

      <div className="grid md:grid-cols-2">

        {/* DAY */}

        <div className="bg-amber-50/40 p-5">

          <div className="flex items-center gap-2">

            <Sun
              size={17}
              className="text-amber-600"
            />

            <span className="text-sm font-bold text-slate-900">
              Day Fare
            </span>

          </div>

          <MoneyInput
            label="Minimum Fare"
            value={
              fare.minimumFare
            }
            onChange={(value) =>
              onUpdate(
                "minimumFare",
                value
              )
            }
          />

          <MoneyInput
            label="Per KM"
            value={
              fare.perKm
            }
            onChange={(value) =>
              onUpdate(
                "perKm",
                value
              )
            }
          />

          <div className="mt-4 rounded-xl bg-white p-3">

            <p className="text-[11px] text-slate-400">
              1 KM Day Fare
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              ₹{dayFare.toFixed(2)}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              ₹{minimum} + ₹{perKm}
            </p>

          </div>

        </div>

        {/* NIGHT */}

        <div className="bg-blue-50/40 p-5">

          <div className="flex items-center gap-2">

            <Moon
              size={17}
              className="text-blue-600"
            />

            <span className="text-sm font-bold text-slate-900">
              Night Fare
            </span>

          </div>

          <div className="mt-5">

            <div className="flex justify-between">

              <span className="text-xs font-semibold text-slate-500">
                Night Adjustment
              </span>

              <span className="text-xs font-bold text-blue-600">
                {night}%
              </span>

            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={night}
              onChange={(event) =>
                onUpdate(
                  "nightAdjustment",
                  event.target.value
                )
              }
              className="mt-4 w-full accent-blue-600"
            />

          </div>

          <div className="mt-4 rounded-xl bg-white p-3">

            <p className="text-[11px] text-slate-400">
              1 KM Night Fare
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              ₹{nightFare.toFixed(2)}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              ₹{dayFare.toFixed(2)} + {night}%
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}) {
  return (
    <label className="mt-5 block">

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
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm font-semibold outline-none focus:border-blue-400"
        />

      </div>

    </label>
  );
}