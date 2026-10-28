import { Link } from "react-router-dom";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-5">
        <h1 className="text-3xl font-bold">OwnTrip</h1>

        <nav className="hidden gap-8 lg:flex">
          <a href="#zones">Zones</a>
          <a href="#vehicles">Vehicles</a>
          <a href="#plans">Plans</a>
          <a href="#download">Download</a>
        </nav>

        <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-lg border px-4 py-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg border px-4 py-2"
            >
              Register
            </Link>
          </div>
      </div>
    </header>
  );
}