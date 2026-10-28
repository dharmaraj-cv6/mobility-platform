export default function FareSummary({
  baseFare = 0,
  distance = 0,
  totalFare = 0,
}) {
  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-3">

      <p className="text-[11px] text-neutral-500">
        Fare summary
      </p>

      <div className="mt-3 space-y-3">

        <div className="flex justify-between">
          <span className="text-[12px] text-neutral-600">
            Base fare
          </span>

          <span className="text-[12px] text-neutral-900">
            ₹{baseFare || "--"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[12px] text-neutral-600">
            Distance
          </span>

          <span className="text-[12px] text-neutral-900">
            {distance > 0
              ? `${distance.toFixed(1)} km`
              : "--"}
          </span>
        </div>

        <div className="border-t border-neutral-100 pt-3">
          <div className="flex justify-between">
            <span className="text-[13px] font-semibold text-neutral-900">
              Total
            </span>

            <span className="text-[15px] font-semibold text-neutral-900">
              ₹{totalFare || "--"}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}