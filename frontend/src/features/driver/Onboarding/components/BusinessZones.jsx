const zones = [
  "Local",
  "Corporate",
  "School",
  "Cargo",
  "Tourist",
  "Yatra",
];

export default function BusinessZones() {
  return (
    <div className="rounded-3xl border p-6">
      <h2 className="mb-4 text-2xl font-bold">
        Business Zones
      </h2>

      <div className="grid gap-3 md:grid-cols-3">
        {zones.map((zone) => (
          <label
            key={zone}
            className="flex items-center gap-3 rounded-xl border p-3"
          >
            <input type="checkbox" />

            {zone}
          </label>
        ))}
      </div>
    </div>
  );
}