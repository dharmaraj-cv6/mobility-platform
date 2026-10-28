export default function ZoneList() {
  const zones = [
    "Local",
    "Corporate",
    "School",
    "Cargo",
    "Tourist",
    "Yatra",
  ];

  return (
    <div className="flex gap-3 overflow-x-auto">
      {zones.map((zone) => (
        <button
          key={zone}
          className="rounded-full border px-4 py-2 whitespace-nowrap"
        >
          {zone}
        </button>
      ))}
    </div>
  );
}