export default function ZoneMenu({
  zones,
  activeZone,
  onZoneChange,
}) {
  return (
    <section>      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {zones.map((zone) => {
          const isActive = activeZone === zone;

          return (
            <button
              key={zone}
              type="button"
              onClick={() => onZoneChange(zone)}
              className={
                isActive
                  ? "rounded-2xl border border-neutral-200 bg-blue-50 p-4 text-left"
                  : "rounded-2xl border border-neutral-200 bg-white p-4 text-left"
              }
            >
              <span className="text-lg font-semibold text-neutral-900">
                {zone}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}