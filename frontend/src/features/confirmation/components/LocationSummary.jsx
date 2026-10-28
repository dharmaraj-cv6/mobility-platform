export default function LocationSummary({
  pickupLocation,
  destination,
}) {
  const pickup =
    pickupLocation?.name ||
    "Current location";

  const drop =
    destination ||
    "Destination";

  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-3">

      <p className="text-[11px] text-neutral-500">
        Trip details
      </p>

      <div className="mt-3">

        {/* Pickup */}
        <div className="flex gap-3">
          <div className="flex w-5 shrink-0 justify-center">
            <span className="text-[14px]">
              ♧
            </span>
          </div>

          <div>
            <p className="text-[11px] text-neutral-500">
              Pickup
            </p>

            <p className="mt-1 text-[13px] text-neutral-900">
              {pickup}
            </p>
          </div>
        </div>

        {/* Drop */}
        <div className="mt-4 flex gap-3">
          <div className="flex w-5 shrink-0 justify-center">
            <span className="text-[14px]">
              ◇
            </span>
          </div>

          <div>
            <p className="text-[11px] text-neutral-500">
              Drop
            </p>

            <p className="mt-1 text-[13px] text-neutral-900">
              {drop}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}