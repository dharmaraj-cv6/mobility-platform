import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleDetailsSchema } from "../validation/vehicleDetailsSchema";

const vehicleTypes = [
  "Bike",
  "Auto",
  "Cab",
  "SUV",
  "Van",
  "Tempo Traveller",
  "Mini Bus",
  "Bus",
  "Goods Vehicle",
];

const fuelTypes = [
  "Petrol",
  "Diesel",
  "CNG",
  "Electric",
  "Hybrid",
];

export default function VehicleDetails({
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
    resolver: zodResolver(vehicleDetailsSchema),
    defaultValues: {
      vehicleType: data.vehicleType || "",
      brand: data.brand || "",
      model: data.model || "",
      registrationNumber: data.registrationNumber || "",
      manufacturingYear: data.manufacturingYear || "",
      fuelType: data.fuelType || "",
      seatCapacity: data.seatCapacity || "",
      color: data.color || "",
    },
  });

  const submit = (values) => {
    updateData(values);
    next();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-8"
    >
      <h2 className="text-2xl font-bold">
        Vehicle Details
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <Select
          label="Vehicle Type"
          register={register("vehicleType")}
          error={errors.vehicleType?.message}
          options={vehicleTypes}
        />

        <Input
          label="Brand"
          register={register("brand")}
          error={errors.brand?.message}
        />

        <Input
          label="Model"
          register={register("model")}
          error={errors.model?.message}
        />

        <Input
          label="Registration Number"
          register={register("registrationNumber")}
          error={errors.registrationNumber?.message}
        />

        <Input
          type="number"
          label="Manufacturing Year"
          register={register("manufacturingYear")}
          error={errors.manufacturingYear?.message}
        />

        <Select
          label="Fuel Type"
          register={register("fuelType")}
          error={errors.fuelType?.message}
          options={fuelTypes}
        />

        <Input
          type="number"
          label="Seat Capacity"
          register={register("seatCapacity")}
          error={errors.seatCapacity?.message}
        />

        <Input
          label="Vehicle Color"
          register={register("color")}
          error={errors.color?.message}
        />

      </div>

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

function Input({
  label,
  register,
  error,
  type = "text",
}) {
  return (
    <div>
      <label className="font-medium">{label}</label>

      <input
        type={type}
        {...register}
        className="mt-2 w-full rounded-lg border p-3"
      />

      <p className="mt-1 text-sm text-red-500">
        {error}
      </p>
    </div>
  );
}

function Select({
  label,
  register,
  error,
  options,
}) {
  return (
    <div>
      <label className="font-medium">{label}</label>

      <select
        {...register}
        className="mt-2 w-full rounded-lg border p-3"
      >
        <option value="">Select</option>

        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      <p className="mt-1 text-sm text-red-500">
        {error}
      </p>
    </div>
  );
}