export default function DriverCard({ driver }) {
  return (
    <div className="rounded-2xl border p-4">
      <h3 className="font-bold">{driver.name}</h3>

      <p>{driver.vehicle}</p>

      <p>{driver.distance}</p>

      <button className="mt-4 rounded-lg border px-4 py-2">
        View Driver
      </button>
    </div>
  );
}