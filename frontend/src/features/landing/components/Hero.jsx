import { useNavigate, Link, } from "react-router-dom";


export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-20vh items-center justify-center px-6 text-center">
      <div>
        <h1 className="mb-6 text-6xl font-bold">
          Discover Local Mobility
        </h1>

        <p className="mb-8 text-xl">
          Choose your driver. Choose your vehicle.
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="rounded-xl border px-8 py-4"
            onClick={() => navigate("/home")}
          >
            Book a Ride
          </button>

          <Link to="/driver/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Driver Registeration
          </Link>
        </div>
      </div>
    </section>
  );
}