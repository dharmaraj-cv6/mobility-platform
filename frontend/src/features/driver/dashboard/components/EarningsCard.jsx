export default function EarningsCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Earnings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your earnings overview.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          Pending
        </span>
      </div>

      {/* Amount */}
      <div className="mt-6">
        <p className="text-sm text-slate-400">
          This Month
        </p>

        <p className="mt-1 text-3xl font-bold text-slate-900">
          ₹0
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">
            Completed Rides
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            0
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">
            Pending Payout
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            ₹0
          </p>
        </div>
      </div>

      {/* Pending message */}
      <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">
          Earnings will appear after approval.
        </p>

        <p className="mt-1 text-xs leading-5 text-amber-700">
          Once your driver account is approved
          and you complete rides, your earnings
          will be shown here.
        </p>
      </div>
    </section>
  );
}