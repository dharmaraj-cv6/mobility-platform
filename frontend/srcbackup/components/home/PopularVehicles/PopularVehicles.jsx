import { useHome } from "../../hooks/useHome";

function PopularVehicles() {
  const { vehicles } = useHome();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Popular Vehicles
        </h2>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-2xl border p-8 text-center shadow"
            >
              {vehicle.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularVehicles;