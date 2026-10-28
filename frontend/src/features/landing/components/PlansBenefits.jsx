const plans = [
  "Bike - ₹199",
  "Auto - ₹229",
  "Cab - ₹269",
  "9 Seater - ₹349",
  "Mini Bus - ₹439",
  "Bus - ₹799",
];

export default function PlansBenefits() {
  return (
    <section
      id="plans"
      className="px-6 py-20"
    >
      <h2 className="mb-12 text-center text-4xl font-bold">
        Subscription Plans
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan}
            className="rounded-2xl border p-8 text-center"
          >
            {plan}
          </div>
        ))}
      </div>
    </section>
  );
}