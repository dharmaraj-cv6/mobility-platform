import { useHome } from "../../hooks/useHome";

function NearbyDrivers() {
  const { drivers } = useHome();

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Featured Drivers
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="rounded-3xl bg-white p-8 shadow"
            >
              <div className="mb-6 h-24 w-24 rounded-full bg-gray-200"></div>

              <h3 className="text-2xl font-semibold">
                {driver.name}
              </h3>

              <p className="mb-6">
                {driver.vehicle}
              </p>

              <button className="rounded-xl border px-6 py-3">
                View Driver
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NearbyDrivers;