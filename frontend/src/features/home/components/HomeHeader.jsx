export default function HomeHeader() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">OwnTrip</h1>

      <button className="rounded-lg border px-4 py-2">
        Profile
      </button>
    </header>
  );
}