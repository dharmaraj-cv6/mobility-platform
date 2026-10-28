import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsSchema } from "../validation/personalDetailsSchema";

export default function PersonalDetails({
    data,
    updateData,
    next,
}) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(personalDetailsSchema),
        defaultValues: data,
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
                    Personal Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Enter your personal information.
                </p>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

                <Input
                    label="Full Name"
                    error={errors.fullName?.message}
                    register={register("fullName")}
                />

                <Input
                    label="Mobile Number"
                    error={errors.mobile?.message}
                    register={register("mobile")}
                />

                <Input
                    label="Email"
                    error={errors.email?.message}
                    register={register("email")}
                />

                <Input
                    type="date"
                    label="Date of Birth"
                    error={errors.dob?.message}
                    register={register("dob")}
                />

                <Select
                    label="Gender"
                    error={errors.gender?.message}
                    register={register("gender")}
                    options={[
                        "Male",
                        "Female",
                        "Other",
                    ]}
                />

                <Input
                    label="Aadhaar Number"
                    error={errors.aadhaar?.message}
                    register={register("aadhaar")}
                />

                <Input
                    label="Driving Licence"
                    error={errors.licenceNumber?.message}
                    register={register("licenceNumber")}
                />

                <Input
                    label="District"
                    error={errors.district?.message}
                    register={register("district")}
                />

                <Input
                    label="State"
                    error={errors.state?.message}
                    register={register("state")}
                />

                <Input
                    label="Pincode"
                    error={errors.pincode?.message}
                    register={register("pincode")}
                />

            </div>

            <div>

                <label className="font-medium">
                    Address
                </label>

                <textarea
                    {...register("address")}
                    rows={4}
                    className="w-full rounded-lg border p-3 mt-2"
                />

                <p className="text-sm text-red-500">
                    {errors.address?.message}
                </p>

            </div>

            <div className="flex justify-end">

                <button
                    className="rounded-lg bg-primary px-8 py-3 text-white"
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

            <label className="font-medium">
                {label}
            </label>

            <input
                type={type}
                {...register}
                className="mt-2 w-full rounded-lg border p-3"
            />

            <p className="text-sm text-red-500 mt-1">
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

            <label className="font-medium">
                {label}
            </label>

            <select
                {...register}
                className="mt-2 w-full rounded-lg border p-3"
            >
                <option value="">
                    Select
                </option>

                {options.map((item) => (
                    <option
                        key={item}
                        value={item}
                    >
                        {item}
                    </option>
                ))}

            </select>

            <p className="text-sm text-red-500 mt-1">
                {error}
            </p>

        </div>
    );
}