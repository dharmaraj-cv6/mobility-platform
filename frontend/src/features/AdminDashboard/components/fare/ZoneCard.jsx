import {
  MapPinned,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronRight,
  Lock,
} from "lucide-react";

import { useState } from "react";

export default function ZoneCard({
  zone,
  farePopupAllowed,
  onFareClick,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <div
      className={[
        "relative min-w-[230px] rounded-2xl border bg-white p-4 text-left transition",

        farePopupAllowed
          ? "cursor-pointer hover:border-blue-400 hover:shadow-md"
          : "border-slate-200",
      ].join(" ")}
      onClick={() =>
        onFareClick(zone)
      }
    >

      {/* =================================================
          MENU
      ================================================= */}

      <div className="absolute right-3 top-3">

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();

            setMenuOpen(
              (current) =>
                !current
            );
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <MoreVertical
            size={17}
          />
        </button>

        {menuOpen && (
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="absolute right-0 top-9 z-30 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
          >

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(zone);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Pencil size={13} />
              Edit Zone
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(zone.id);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={13} />
              Delete Zone
            </button>

          </div>
        )}

      </div>

      {/* =================================================
          ICON
      ================================================= */}

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

        <MapPinned
          size={23}
          className="text-blue-600"
        />

      </div>

      {/* =================================================
          SERVICE TITLE
      ================================================= */}

      <h3 className="mt-4 text-base font-bold text-slate-900">
        City Ride
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        All local rides and outer rides
      </p>

      {/* =================================================
          ZONE
      ================================================= */}

      <div className="mt-4 border-t border-slate-100 pt-3">

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold text-slate-500">
            {zone.name}
          </span>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
            Active
          </span>

        </div>

        <p className="mt-1 text-xs text-slate-500">
          {zone.location}
        </p>

      </div>

      {/* =================================================
          FARE ACTION
      ================================================= */}

      {farePopupAllowed ? (

        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-blue-600">

          <span>
            Manage Fare
          </span>

          <ChevronRight
            size={15}
          />

        </div>

      ) : (

        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">

          <Lock size={13} />

          <span>
            Fare unavailable
          </span>

        </div>

      )}

    </div>
  );
}