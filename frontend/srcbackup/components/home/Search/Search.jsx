function Search() {
  return (
    <section className="-mt-20 px-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="grid gap-4 lg:grid-cols-4">
          <input
            className="rounded-xl border p-4"
            placeholder="Pickup"
          />

          <input
            className="rounded-xl border p-4"
            placeholder="Drop"
          />

          <select className="rounded-xl border p-4">
            <option>Select Zone</option>

            <option>Local Ride</option>

            <option>Corporate Ride</option>

            <option>School Ride</option>

            <option>Cargo Ride</option>

            <option>Tourist Ride</option>

            <option>Yatra</option>
          </select>

          <button className="rounded-xl border p-4 font-semibold">
            Search Drivers
          </button>
        </div>
      </div>
    </section>
  );
}

export default Search;