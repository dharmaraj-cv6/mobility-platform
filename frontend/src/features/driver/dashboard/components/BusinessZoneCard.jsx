export default function BusinessZoneCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Business Zone
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Choose and manage the areas where you
            want to provide your mobility services.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          Pending
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-700">
          Business zone is not available yet.
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Your business zone settings will become
          available after your driver account is
          approved.
        </p>
      </div>

      <button
        type="button"
        disabled
        className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
      >
        🔒 Manage Business Zone
      </button>
    </section>
  );
}