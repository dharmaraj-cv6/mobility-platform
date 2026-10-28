export default function RideStatus() {
  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-4">
      <p className="text-[12px] font-medium leading-4 text-neutral-500">
        Booking status
      </p>

      <h2 className="mt-1 text-[17px] font-semibold leading-6 text-neutral-900">
        Ride confirmed
      </h2>

      <p className="mt-1 text-[13px] leading-5 text-neutral-500">
        Your driver is on the way to the pickup location.
      </p>
    </section>
  );
}