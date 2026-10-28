export default function ZonePreviewCard({ zone }) {
  return (
    <div className="w-56 rounded-2xl border bg-white p-4 shadow">
      <h3 className="mb-4 text-center text-lg font-semibold">
        {zone.title}
      </h3>

      <div className="mb-4 flex justify-center gap-2">
        {zone.services.map((service) => (
          <span
            key={service}
            className="rounded-full border px-2 py-1 text-xs"
          >
            {service}
          </span>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {zone.vehicles.map((vehicle) => (
          <div
            key={vehicle}
            className="rounded-lg border p-2 text-center text-xs"
          >
            {vehicle}
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-xl border p-3">
        <p className="text-sm">Starting fare</p>

        <p className="text-xl font-bold">{zone.fare}</p>
      </div>

      <button className="w-full rounded-xl border py-3">
        View Zone
      </button>
    </div>
  );
}