export default function DriverLeadCard({
  lead,
  accepting = false,
  onAccept,
  onReject,
}) {
  if (!lead) return null;

  const pickup =
    lead.pickupLocation ||
    lead.pickup ||
    lead.booking?.pickupLocation ||
    "Pickup location";

  const destination =
    lead.destination ||
    lead.dropLocation ||
    lead.booking?.destination ||
    "Destination";

  const fare =
    lead.fare ??
    lead.totalFare ??
    lead.booking?.fare ??
    null;

  const distance =
    lead.distance ??
    lead.tripDistance ??
    lead.booking?.tripDistance ??
    null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            New Ride Lead
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {lead.serviceType || lead.booking?.serviceType || "City Ride"}
          </p>
        </div>

        {fare !== null && (
          <div className="text-right">
            <p className="text-xs text-slate-400">Fare</p>

            <p className="text-lg font-bold text-slate-900">
              ₹{fare}
            </p>
          </div>
        )}
      </div>

      {/* Route */}
      <div className="mt-4 space-y-3">
        <div className="flex gap-3">
          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-700" />

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase text-slate-400">
              Pickup
            </p>

            <p className="mt-0.5 text-sm font-medium text-slate-700">
              {pickup}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-slate-400" />

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase text-slate-400">
              Drop
            </p>

            <p className="mt-0.5 text-sm font-medium text-slate-700">
              {destination}
            </p>
          </div>
        </div>
      </div>

      {/* Trip information */}
      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
        {distance !== null && (
          <div>
            <p className="text-[11px] text-slate-400">Distance</p>
            <p className="text-sm font-semibold text-slate-700">
              {distance} km
            </p>
          </div>
        )}

        {lead.duration && (
          <div>
            <p className="text-[11px] text-slate-400">Duration</p>
            <p className="text-sm font-semibold text-slate-700">
              {lead.duration}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={accepting}
          onClick={() => onReject?.(lead.id)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>

        <button
          type="button"
          disabled={accepting}
          onClick={() => onAccept?.(lead.id)}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {accepting ? "Processing..." : "Accept"}
        </button>
      </div>
    </div>
  );
}