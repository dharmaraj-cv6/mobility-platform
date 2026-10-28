export default function VerificationBanner({
  status,
}) {
  if (status === "APPROVED") return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-amber-900">
            Verification Pending
          </h3>

          <p className="mt-1 text-sm text-amber-700">
            Our team is reviewing your
            driver, vehicle and documents.
          </p>
        </div>

        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Pending
        </span>
      </div>
    </div>
  );
}