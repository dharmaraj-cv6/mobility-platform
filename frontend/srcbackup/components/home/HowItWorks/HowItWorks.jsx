function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold">
          How It Works
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-8">
            Select a Zone
          </div>

          <div className="rounded-2xl border bg-white p-8">
            Choose a Driver
          </div>

          <div className="rounded-2xl border bg-white p-8">
            Send a Request
          </div>

          <div className="rounded-2xl border bg-white p-8">
            Start Your Journey
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;