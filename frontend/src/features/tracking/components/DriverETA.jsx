import { Clock3 } from "lucide-react";

export default function DriverETA({ eta }) {
  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-medium leading-4 text-neutral-500">
            Estimated arrival
          </p>

          <p className="mt-1 text-[20px] font-semibold leading-6 text-neutral-900">
            {eta != null ? `${eta} minutes` : "--"}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-50">
          <Clock3
            size={18}
            strokeWidth={1.8}
            className="text-neutral-600"
          />
        </div>
      </div>
    </section>
  );
}