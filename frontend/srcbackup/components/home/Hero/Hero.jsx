import { useHome } from "../hooks/useHome";

function Hero() {
  const { hero } = useHome();

  return (
    <section className="flex min-h-screen items-center px-6 pt-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="mb-6 text-6xl font-bold">
            {hero.title}
          </h1>

          <p className="mb-8 text-xl">
            {hero.subtitle}
          </p>

          <div className="flex gap-4">
            <button className="rounded-xl border px-8 py-4">
              Book Now
            </button>

            <button className="rounded-xl border px-8 py-4">
              Become a Driver
            </button>
          </div>
        </div>

        <div className="rounded-3xl border p-10">
          Vehicle Illustration
        </div>
      </div>
    </section>
  );
}

export default Hero;