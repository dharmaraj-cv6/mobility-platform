import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessTypeSchema } from "../validation/businessTypeSchema";

const businessTypes = [
  {
    id: "ACTIVE_DRIVER",
    title: "Active Driver",
    description: "Drive using your own or another owner's vehicle.",
  },
  {
    id: "VEHICLE_OWNER",
    title: "Vehicle Owner",
    description: "Register vehicles and assign drivers.",
  },
  {
    id: "DRIVER_OWNER",
    title: "Driver + Vehicle Owner",
    description: "Drive your own registered vehicle.",
  },
];

export default function BusinessType({
  data,
  updateData,
  next,
  previous,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessTypeSchema),
    defaultValues: {
      businessType: data.businessType || "",
    },
  });

  const submitHandler = (values) => {
    updateData(values);
    next();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold">
          Choose Business Type
        </h2>

        <p className="text-gray-500 mt-1">
          Select how you want to join the platform.
        </p>
      </div>

      <div className="grid gap-5">

        {businessTypes.map((item) => (

          <label
            key={item.id}
            className="flex cursor-pointer items-start gap-4 rounded-xl border p-5 hover:border-primary"
          >
            <input
              type="radio"
              value={item.id}
              {...register("businessType")}
              className="mt-1"
            />

            <div>
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {item.description}
              </p>
            </div>

          </label>

        ))}

      </div>

      <p className="text-sm text-red-500">
        {errors.businessType?.message}
      </p>

      <div className="flex justify-between">

        <button
          type="button"
          onClick={previous}
          className="rounded-lg border px-6 py-3"
        >
          Back
        </button>

        <button
          className="rounded-lg bg-primary px-6 py-3 text-white"
        >
          Continue
        </button>

      </div>

    </form>
  );
}