export default function PaymentSummary({
  booking,
}) {
  const baseFare =
    booking?.baseFare ?? 0;

  const distanceFare =
    booking?.distanceFare ?? 0;

  const extraKmFare =
    booking?.extraKmFare ?? 0;

  const totalFare =
    booking?.totalFare ??
    baseFare +
      distanceFare +
      extraKmFare;

  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-5">

      <h2 className="text-[16px] font-semibold text-neutral-900">
        Fare summary
      </h2>

      <div className="mt-4 space-y-3">

        {/* Base Fare */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-neutral-500">
            Base fare
          </span>

          <span className="text-[12px] font-medium text-neutral-900">
            ₹{baseFare}
          </span>
        </div>

        {/* Distance Fare */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-neutral-500">
            Distance fare
          </span>

          <span className="text-[12px] font-medium text-neutral-900">
            ₹{distanceFare}
          </span>
        </div>

        {/* Extra KM */}
        {extraKmFare > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-neutral-500">
              Extra KM fare
            </span>

            <span className="text-[12px] font-medium text-neutral-900">
              ₹{extraKmFare}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-neutral-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-neutral-900">
              Total fare
            </span>

            <span className="text-[18px] font-semibold text-neutral-900">
              ₹{totalFare}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}