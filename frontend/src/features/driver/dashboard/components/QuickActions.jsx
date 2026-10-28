import { useNavigate } from "react-router-dom";

export default function QuickActions({
  driverStatus = "PENDING",
}) {
  const navigate = useNavigate();

  const isApproved =
    driverStatus === "APPROVED";

  const actionClass = isApproved
    ? "border-slate-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    : "cursor-not-allowed border-slate-200 opacity-60";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {/* Fare Settings */}

      <button
        type="button"
        disabled={!isApproved}
        onClick={() =>
          isApproved &&
          navigate(
            "/driver/fare-settings"
          )
        }
        className={`rounded-2xl border bg-white p-5 text-left transition ${actionClass}`}
      >
        <div className="mb-4 text-2xl">
          💰
        </div>

        <h3 className="font-semibold text-slate-900">
          Business Fare
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {isApproved
            ? "Configure your business fares."
            : "Available after approval."}
        </p>

        {!isApproved && (
          <span className="mt-3 inline-block text-xs font-semibold text-slate-400">
            🔒 Locked
          </span>
        )}
      </button>

      {/* Go Online */}

      <button
        type="button"
        disabled={!isApproved}
        className={`rounded-2xl border bg-white p-5 text-left transition ${actionClass}`}
      >
        <div className="mb-4 text-2xl">
          🟢
        </div>

        <h3 className="font-semibold text-slate-900">
          Go Online
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {isApproved
            ? "Start receiving ride requests."
            : "Available after approval."}
        </p>

        {!isApproved && (
          <span className="mt-3 inline-block text-xs font-semibold text-slate-400">
            🔒 Locked
          </span>
        )}
      </button>

      {/* Bookings */}

      <button
        type="button"
        disabled={!isApproved}
        className={`rounded-2xl border bg-white p-5 text-left transition ${actionClass}`}
      >
        <div className="mb-4 text-2xl">
          🚕
        </div>

        <h3 className="font-semibold text-slate-900">
          Bookings
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {isApproved
            ? "Manage your ride bookings."
            : "Available after approval."}
        </p>

        {!isApproved && (
          <span className="mt-3 inline-block text-xs font-semibold text-slate-400">
            🔒 Locked
          </span>
        )}
      </button>

      {/* Earnings */}

      <button
        type="button"
        className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
      >
        <div className="mb-4 text-2xl">
          📊
        </div>

        <h3 className="font-semibold text-slate-900">
          Earnings
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          View your earnings and payouts.
        </p>
      </button>

    </div>
  );
}