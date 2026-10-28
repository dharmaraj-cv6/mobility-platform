export default function DashboardWelcome({
  driver,
  driverStatus = "PENDING",
}) {
  const firstName =
    driver?.fullName
      ?.trim()
      ?.split(" ")[0] || "Business";

  const isApproved =
    driverStatus === "APPROVED";

  return (
    <section className="py-2">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

        {/* Welcome */}

        <div>
          <p className="text-sm font-medium text-slate-500">
            Welcome back
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {firstName}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your business, vehicles,
            rides and daily operations from
            one place.
          </p>
        </div>

        {/* Status */}

        <div
          className={[
            "inline-flex w-fit items-center gap-2",
            "rounded-full px-4 py-2",
            "text-sm font-semibold",
            isApproved
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 rounded-full",
              isApproved
                ? "bg-emerald-500"
                : "bg-amber-500",
            ].join(" ")}
          />

          {isApproved
            ? "Business Active"
            : "Verification Pending"}
        </div>

      </div>
    </section>
  );
}