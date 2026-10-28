import { useHome } from "../../hooks/useHome";

function BusinessZones() {
  const { zones } = useHome();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Business Zones
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-2xl border p-8 shadow"
            >
              <h3 className="text-2xl font-semibold">
                {zone.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BusinessZones;