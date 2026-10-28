export default function WatcherAlert({
  count = 0,
  serviceType = null,
}) {
  if (Number(count) <= 0) {
    return null;
  }

  return (
    <div
      className="
        flex
        min-h-[110px]
        min-w-[220px]
        items-center
        justify-center
        rounded-2xl
        border
        border-blue-200
        bg-blue-50
        px-5
        py-4
        shadow-sm
        sm:w-[240px]
      "
    >
      <div className="text-center">
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-blue-600
          "
        >
          Someone is watching
        </p>

        <p
          className="
            mt-1
            text-5xl
            font-bold
            leading-none
            text-blue-700
          "
        >
          {count}
        </p>

        {serviceType && (
          <p
            className="
              mt-2
              text-[11px]
              font-medium
              text-blue-500
            "
          >
            {serviceType}
          </p>
        )}
      </div>
    </div>
  );
}
