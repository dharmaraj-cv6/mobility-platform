export default function RideStatistics() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Ride Statistics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your ride activity overview.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          This Month
        </span>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-medium text-slate-400">
            Total Rides
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            0
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-medium text-slate-400">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            0
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-medium text-slate-400">
            Cancelled
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            0
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-medium text-slate-400">
            Acceptance
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            0%
          </p>
        </div>
      </div>

      {/* Pending State */}
      <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">
          Ride statistics are not available yet.
        </p>

        <p className="mt-1 text-xs leading-5 text-amber-700">
          Statistics will start updating after your
          driver account is approved and you begin
          accepting rides.
        </p>
      </div>
    </section>
  );
}