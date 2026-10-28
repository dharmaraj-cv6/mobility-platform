export default function SubscriptionCard() {
  return (
    <div className="rounded-3xl border p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-bold">
        Subscription
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Plan</span>

          <span>Auto - ₹229</span>
        </div>

        <div className="flex justify-between">
          <span>Status</span>

          <span>Active</span>
        </div>

        <div className="flex justify-between">
          <span>Valid Until</span>

          <span>31-12-2026</span>
        </div>

        <div className="flex justify-between">
          <span>Free Trial</span>

          <span>3 Days</span>
        </div>
      </div>

      <button className="mt-6 w-full rounded-2xl border py-3 font-semibold">
        Renew Subscription
      </button>
    </div>
  );
}