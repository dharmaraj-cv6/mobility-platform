const filters = [
  {
    id: 1,
    name: "All",
    icon: "🚕",
  },
  {
    id: 2,
    name: "Favorite",
    icon: "⭐",
  },
  {
    id: 3,
    name: "My Ride",
    icon: "🚗",
  },
  {
    id: 4,
    name: "Women Drivers",
    icon: "👩",
  },
 
];

export default function RideFilter() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {filters.map((filter, index) => (
        <button
          key={filter.id}
          className={`flex min-w-fit items-center gap-2 rounded-full border border-neutral-200 px-5 py-3 whitespace-nowrap ${
            index === 0 ? "bg-blue-600 text-white" : ""
          }`}
        >
          <span>{filter.icon}</span>

          <span>{filter.name}</span>
        </button>
      ))}
    </div>
  );
}