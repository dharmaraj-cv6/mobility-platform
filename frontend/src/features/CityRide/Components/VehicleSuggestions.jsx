const vehicles = [
  {
    id: "auto",
    label: "Auto",
    icon: "🛺",
  },
  {
    id: "cab",
    label: "Cab",
    icon: "🚕",
  },
  {
    id: "premium",
    label: "Premium",
    icon: "🚙",
  },
  {
    id: "more",
    label: "More",
    icon: "▦",
  },
];

export default function VehicleSuggestions() {
  return (
    <div className="vehicle-options">

      {vehicles.map((vehicle) => (
        <button
          key={vehicle.id}
          type="button"
          className="vehicle-option"
        >

          <span className="vehicle-option__icon">
            {vehicle.icon}
          </span>

          <span className="vehicle-option__label">
            {vehicle.label}
          </span>

        </button>
      ))}

    </div>
  );
}