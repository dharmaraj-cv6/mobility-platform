const vehicles = [
  "Bike",
  "Auto",
  "Cab",
  "Mini Bus",
  "Tempo Traveler",
  "Bus",
];

export default function VehicleCategories() {
  return (
    <section
      id="vehicles"
      className="px-6 py-20"
    >
      <h2 className="mb-12 text-center text-4xl font-bold">
        Vehicle Categories
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle}
            className="rounded-2xl border p-8 text-center"
          >
            {vehicle}
          </div>
        ))}
      </div>
    </section>
  );
}