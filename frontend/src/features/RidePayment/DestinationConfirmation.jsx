import { MapPin } from "lucide-react";

export default function DestinationConfirmation({
  isOpen,
  destination,
  distanceFromDestination,
  onReached,
  onNotYet,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-[18px] border border-neutral-200 bg-white p-5 shadow-lg">

        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50">
          <MapPin
            size={19}
            strokeWidth={1.8}
            className="text-neutral-700"
          />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-[17px] font-semibold leading-5 text-neutral-900">
          Have you reached your destination?
        </h2>

        {/* Destination */}
        <p className="mt-2 text-[12px] leading-5 text-neutral-500">
          {destination || "Your selected destination"}
        </p>

        {/* Distance */}
        {distanceFromDestination != null && (
          <p className="mt-1 text-[11px] leading-4 text-neutral-400">
            {distanceFromDestination} away from destination
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onNotYet}
            className="
              h-[44px]
              rounded-[12px]
              border
              border-neutral-200
              bg-white
              px-3
              text-[12px]
              font-medium
              text-neutral-700
              transition
              hover:bg-neutral-50
            "
          >
            Not yet
          </button>

          <button
            type="button"
            onClick={onReached}
            className="
              h-[44px]
              rounded-[12px]
              bg-neutral-900
              px-3
              text-[12px]
              font-medium
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            Yes, I reached
          </button>
        </div>
      </div>
    </div>
  );
}