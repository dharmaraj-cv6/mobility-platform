import zoneConfig from "../data/zoneConfig";

export default function CityRideZone({
  activeZone,
  activeMenu,
  onMenuChange,
}) {
  const config = zoneConfig[activeZone?.id];

  if (!activeZone || !config) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <p className="text-sm text-red-500">
          Zone configuration not found.
        </p>
      </section>
    );
  }

  return (
    <section className="p-0">

      {/* Zone Header */}
      <div className="mb-5">       

        <h2 className="mt-1 text-2xl font-bold text-neutral-900">
          {activeZone.title}
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Choose how you want to book your ride.
        </p>
      </div>

      {/* Booking Options */}
      <div>        

        <div className="flex p-6 rounded-2xl border border-neutral-200 bg-white flex-wrap gap-2">
          {config.menus.map((menu) => {
            const isActive = activeMenu === menu;

            return (
              <button
                key={menu}
                type="button"
                onClick={() => onMenuChange(menu)}
                className={`
                  rounded-xl border px-4 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-primary-300 hover:bg-primary-50"
                  }
                `}
              >
                {menu}
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
}