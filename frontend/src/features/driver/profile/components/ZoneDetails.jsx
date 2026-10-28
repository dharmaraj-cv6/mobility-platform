const zones = ["Local", "Corporate", "School"];

export default function ZoneDetails() {
  return (
    <div className="rounded-3xl border p-6">
      <h3 className="mb-4 text-xl font-bold">
        Business Zones
      </h3>

      <div className="flex flex-wrap gap-3">
        {zones.map((zone) => (
          <span
            key={zone}
            className="rounded-full border px-4 py-2"
          >
            {zone}
          </span>
        ))}
      </div>
    </div>
  );
}