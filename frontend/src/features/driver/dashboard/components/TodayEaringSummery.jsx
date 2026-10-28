import {
  Luggage,
  Navigation,
  Users,
} from "lucide-react";

// =====================================================
// NEARBY RIDE REQUESTS
//
// Header layout:
//
// LEFT COLUMN
//   NEW RIDE REQUESTS NEAR YOU
//   Riders within 3–5 km from your current location
//
// RIGHT COLUMN
//   TODAY
//   Business Summary
//   Rides / Done / Earn. / Online
//
// The header uses the SAME responsive column ratio as
// the map section below, so both areas align perfectly.
// =====================================================

export default function TodayEaringSummery({
  requests = [],
  loading = false,
  acceptingId,
  onAccept,
}) {
  return (
    <section className="w-full min-w-0 overflow-hidden  bg-white shadow-sm">

      {/* =================================================
          HEADER
          SAME COLUMN STRUCTURE AS MAP
      ================================================= */}

      <div className="grid min-w-0 border-b border-slate-100 lg:grid-cols-[0.95fr_1.55fr]">

        {/* =================================================
            LEFT — NEW RIDE REQUESTS
        ================================================= */}

        <div className="min-w-0 p-5 lg:border-r lg:border-slate-100">

          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            NEW RIDE REQUESTS NEAR YOU
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Riders within 3–5 km from your current location
          </p>

        </div>


        {/* =================================================
            RIGHT — BUSINESS SUMMARY
        ================================================= */}

        <div className="min-w-0 p-4 sm:p-5">

          <div className="flex min-h-[72px] w-full min-w-0 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

            <div className="flex w-full min-w-0 items-center gap-4">

              {/* TITLE */}

              <div className="min-w-0 shrink-0">

                <div className="flex items-center gap-2">

                  <span className="truncate text-sm font-bold text-slate-900">
                    Today Earning Summary
                  </span>

                </div>

              </div>


              {/* DIVIDER */}

              <div className="h-7 w-px shrink-0 bg-slate-200" />


              {/* METRICS */}

              <div className="grid min-w-0 flex-1 grid-cols-4 items-center gap-2 sm:gap-4">

                <SummaryItem
                  label="RIDES"
                  value="0"
                />

                <SummaryItem
                  label="DONE"
                  value="0"
                />

                <SummaryItem
                  label="EARN."
                  value="₹0"
                />

                <SummaryItem
                  label="ONLINE"
                  value="0h"
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading &&
        requests.length === 0 && (
          <div className="p-5">

            <div className="rounded-2xl bg-slate-50 p-8 text-center">

              <p className="text-sm text-slate-500">
                Looking for nearby rides...
              </p>

            </div>

          </div>
        )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        requests.length === 0 && (
          <div className="p-5">

            <div className="rounded-2xl bg-slate-50 p-8 text-center">

              <Navigation
                size={28}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No new ride requests
              </p>

              <p className="mt-1 text-xs text-slate-500">
                New requests within 5 km will appear
                automatically.
              </p>

            </div>

          </div>
        )}


      {/* =================================================
          REQUESTS
      ================================================= */}

      {requests.length > 0 && (
        <div className="space-y-3 p-5">

          {requests.map(
            (request) => (
              <article
                key={request.id}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >

                <div className="p-4">

                  {/* DISTANCE */}

                  <div className="flex flex-wrap items-center justify-between gap-2">

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">

                      {Number(
                        request.distanceKm || 0
                      ).toFixed(1)}{" "}
                      km away

                    </span>

                    <span className="text-xs text-slate-400">
                      {request.timeAgo ||
                        "Just now"}
                    </span>

                  </div>


                  {/* ROUTE */}

                  <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">

                    <div className="min-w-0">

                      {/* PICKUP */}

                      <div className="flex min-w-0 gap-3">

                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

                        <div className="min-w-0">

                          <p className="text-[11px] text-slate-400">
                            Pickup
                          </p>

                          <p className="break-words text-sm font-semibold text-slate-800">
                            {request.pickup}
                          </p>

                        </div>

                      </div>


                      {/* ROUTE LINE */}

                      <div className="ml-1.5 h-5 border-l border-dashed border-slate-300" />


                      {/* DROP-OFF */}

                      <div className="flex min-w-0 gap-3">

                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-900" />

                        <div className="min-w-0">

                          <p className="text-[11px] text-slate-400">
                            Drop-off
                          </p>

                          <p className="break-words text-sm font-semibold text-slate-800">
                            {request.dropoff}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* FARE */}

                    <div className="text-left sm:text-right">

                      <p className="text-xl font-bold text-slate-900">
                        ₹{request.fare || 0}
                      </p>

                      <p className="mt-1 text-xs text-blue-600">
                        {request.category ||
                          "Ride"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* FOOTER */}

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4 text-xs text-slate-500">

                    <span className="flex items-center gap-1.5">
                      <Users size={13} />
                      {request.riders || 1}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Luggage size={13} />
                      {request.luggage ||
                        "None"}
                    </span>

                  </div>

                  <button
                    type="button"
                    disabled={
                      acceptingId ===
                      request.id
                    }
                    onClick={() =>
                      onAccept(
                        request.id
                      )
                    }
                    className="h-10 w-full rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {acceptingId ===
                    request.id
                      ? "Accepting..."
                      : "Accept Ride"}
                  </button>

                </div>

              </article>
            )
          )}

        </div>
      )}

    </section>
  );
}


// =====================================================
// BUSINESS SUMMARY ITEM
// =====================================================

function SummaryItem({
  label,
  value,
}) {
  return (
    <div className="min-w-0 text-center">

      <p className="truncate text-[8px] font-semibold tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-bold leading-none text-slate-900 sm:text-base">
        {value}
      </p>

    </div>
  );
}
