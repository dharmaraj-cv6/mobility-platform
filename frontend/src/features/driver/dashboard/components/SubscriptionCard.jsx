export default function SubscriptionCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Subscription
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your driver subscription plan.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          Not Active
        </span>
      </div>

      {/* Current Plan */}
      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <p className="text-xs font-medium text-slate-400">
          Current Plan
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900">
          No Subscription
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your subscription options will be
          available after your driver account
          is approved.
        </p>
      </div>

      {/* Action */}
      <button
        type="button"
        disabled
        className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
      >
        🔒 View Subscription Plans
      </button>

      {/* Status */}
      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">
          Available after approval
        </p>

        <p className="mt-1 text-xs leading-5 text-amber-700">
          Once your driver account is approved,
          you can choose a subscription plan
          suitable for your business.
        </p>
      </div>
    </section>
  );
}