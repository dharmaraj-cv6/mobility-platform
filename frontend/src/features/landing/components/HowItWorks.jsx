const steps = [
  "When",
  "Where",
  "How", 
  "GoSago",
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-20">
      <h2 className="mb-12 text-center text-4xl font-bold">
        How It Works
      </h2>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step}
            className="rounded-2xl border p-6 text-center"
          >
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}