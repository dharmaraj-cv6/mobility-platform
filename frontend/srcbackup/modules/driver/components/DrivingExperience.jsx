import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { drivingExperienceSchema } from "../validation/drivingExperienceSchema";

const platforms = [
  "Own Taxi",
  "Ola",
  "Uber",
  "Rapido",
  "Namma Yatri",
  "Tourist",
  "Corporate",
  "School Transport",
];

const languages = [
  "Tamil",
  "English",
  "Hindi",
  "Telugu",
  "Malayalam",
  "Kannada",
];

export default function DrivingExperience({
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
    resolver: zodResolver(drivingExperienceSchema),
    defaultValues: {
      experience: data.experience || "",
      workedPlatforms: data.workedPlatforms || [],
      languages: data.languages || [],
    },
  });

  const onSubmit = (values) => {
    updateData(values);
    next();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <h2 className="text-2xl font-bold">
        Driving Experience
      </h2>

      <div>
        <label className="font-medium">
          Driving Experience
        </label>

        <select
          {...register("experience")}
          className="mt-2 w-full rounded-lg border p-3"
        >
          <option value="">Select</option>
          <option>Fresher</option>
          <option>1 - 3 Years</option>
          <option>3 - 5 Years</option>
          <option>5 - 10 Years</option>
          <option>10+ Years</option>
        </select>

        <p className="text-sm text-red-500">
          {errors.experience?.message}
        </p>
      </div>

      <div>
        <label className="font-medium">
          Previously Worked
        </label>

        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {platforms.map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={item}
                {...register("workedPlatforms")}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="font-medium">
          Languages Known
        </label>

        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {languages.map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={item}
                {...register("languages")}
              />
              {item}
            </label>
          ))}
        </div>
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