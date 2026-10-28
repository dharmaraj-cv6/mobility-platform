


export default function ActiveRideCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Active Ride
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current ride activity will appear here.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          No Active Ride
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-center">
        <p className="text-sm text-slate-500">
          You don't have an active ride right now.
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Ride requests will appear here after your
          account is approved.
        </p>
      </div>
    </section>
  );
}