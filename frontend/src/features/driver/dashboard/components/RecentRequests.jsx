export default function RecentRequests() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Recent Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest ride requests will appear here.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          0 Requests
        </span>
      </div>

      {/* Empty State */}
      <div className="mt-5 rounded-2xl bg-slate-50 px-6 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
          🚕
        </div>

        <h3 className="mt-4 font-semibold text-slate-800">
          No ride requests yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Ride requests will appear here once
          your driver account is approved and
          you are available to receive rides.
        </p>

        <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Verification Pending
        </span>
      </div>
    </section>
  );
}