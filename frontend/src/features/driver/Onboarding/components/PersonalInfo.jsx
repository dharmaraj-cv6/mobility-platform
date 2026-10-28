import {
  useEffect,
  useState,
} from "react";

import OnboardingActions from "./OnboardingActions";

export default function PersonalInfo({
  value,
  user,
  onChange,
  onNext,
  onBack,
  onCancel,
}) {
  const [form, setForm] = useState({
    driverPhoto:
      value?.driverPhoto || null,

    dob: value?.dob || "",
    gender: value?.gender || "",
    aadhaar: value?.aadhaar || "",
    licenceNumber:
      value?.licenceNumber || "",
    address: value?.address || "",
    district: value?.district || "",
    state: value?.state || "",
    pincode: value?.pincode || "",
  });

  const [
    driverPhotoPreview,
    setDriverPhotoPreview,
  ] = useState(null);

  // ========================================
  // SYNC FORM
  // ========================================

  useEffect(() => {
    setForm({
      driverPhoto:
        value?.driverPhoto || null,

      dob: value?.dob || "",
      gender: value?.gender || "",
      aadhaar: value?.aadhaar || "",
      licenceNumber:
        value?.licenceNumber || "",
      address: value?.address || "",
      district: value?.district || "",
      state: value?.state || "",
      pincode: value?.pincode || "",
    });
  }, [value]);

  // ========================================
  // PHOTO PREVIEW
  // ========================================

  useEffect(() => {
    if (!form.driverPhoto) {
      setDriverPhotoPreview(null);
      return;
    }

    if (
      typeof form.driverPhoto ===
      "string"
    ) {
      setDriverPhotoPreview(
        form.driverPhoto
      );
      return;
    }

    if (
      form.driverPhoto instanceof File
    ) {
      const objectUrl =
        URL.createObjectURL(
          form.driverPhoto
        );

      setDriverPhotoPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(
          objectUrl
        );
      };
    }
  }, [form.driverPhoto]);

  // ========================================
  // UPDATE FIELD
  // ========================================

  const updateField = (
    field,
    fieldValue
  ) => {
    const updatedForm = {
      ...form,
      [field]: fieldValue,
    };

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  // ========================================
  // PHOTO
  // ========================================

  const handleDriverPhoto = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    updateField(
      "driverPhoto",
      file
    );
  };

  const handleRemovePhoto = () => {
    updateField(
      "driverPhoto",
      null
    );
  };

  // ========================================
  // NEXT
  // ========================================

  const handleNext = () => {
    if (!form.dob) {
      alert(
        "Date of birth is required."
      );
      return;
    }

    if (!form.gender) {
      alert("Gender is required.");
      return;
    }

    if (
      !/^\d{12}$/.test(
        form.aadhaar
      )
    ) {
      alert(
        "Enter a valid 12-digit Aadhaar number."
      );
      return;
    }

    if (
      !form.licenceNumber.trim()
    ) {
      alert(
        "Driving licence number is required."
      );
      return;
    }

    if (!form.address.trim()) {
      alert("Address is required.");
      return;
    }

    if (!form.district.trim()) {
      alert(
        "District is required."
      );
      return;
    }

    if (!form.state.trim()) {
      alert("State is required.");
      return;
    }

    if (
      !/^\d{6}$/.test(
        form.pincode
      )
    ) {
      alert(
        "Enter a valid 6-digit pincode."
      );
      return;
    }

    onNext?.(form);
  };

  return (
    <div className="w-full">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Driver Details
        </h2>

        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-[13px]">
          Your registered account information
          is shown automatically. Complete the
          remaining details for verification.
        </p>
      </div>

      {/* ================================= */}
      {/* TWO COLUMN LAYOUT */}
      {/* ================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">

        {/* ================================= */}
        {/* LEFT COLUMN */}
        {/* PHOTO + ADDRESS */}
        {/* ================================= */}

        <div className="space-y-5">

          {/* DRIVER PHOTO */}

          <section>
            <div className="mb-3">
              <h3 className="text-[15px] font-semibold text-slate-900">
                Driver Photo
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Upload a clear passport-size photo.
              </p>
            </div>

            {!driverPhotoPreview ? (
              <label className="flex h-[220px] w-full max-w-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-blue-400 hover:bg-blue-50/40">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base shadow-sm">
                  📷
                </div>

                <p className="mt-2.5 text-xs font-semibold text-slate-800">
                  Upload driver photo
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Passport-size photo
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  JPG, JPEG, PNG or WEBP
                </p>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={
                    handleDriverPhoto
                  }
                />
              </label>
            ) : (
              <div className="w-full max-w-[240px]">

                <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                  <img
                    src={
                      driverPhotoPreview
                    }
                    alt="Driver preview"
                    className="h-full w-full object-contain"
                  />

                  {/* ACTION ICONS */}

                  <div className="absolute right-2.5 top-2.5 flex gap-1.5">

                    {/* CROP */}

                    <button
                      type="button"
                      title="Crop"
                      aria-label="Crop driver photo"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-xs shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      ✂
                    </button>

                    {/* EDIT */}

                    <label
                      title="Edit"
                      aria-label="Edit driver photo"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/95 text-xs shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      ✎

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={
                          handleDriverPhoto
                        }
                      />
                    </label>

                    {/* REMOVE */}

                    <button
                      type="button"
                      title="Remove"
                      aria-label="Remove driver photo"
                      onClick={
                        handleRemovePhoto
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white/95 text-xs text-red-600 shadow-sm transition hover:bg-red-50"
                    >
                      🗑
                    </button>

                  </div>
                </div>

                <p className="mt-1.5 truncate text-[11px] text-slate-500">
                  {form.driverPhoto?.name ||
                    "Driver photo"}
                </p>
              </div>
            )}
          </section>

          {/* ADDRESS */}

          <section>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
              Address
            </label>

            <textarea
              value={form.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              placeholder="Enter complete address"
              rows={5}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-[13px] leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </section>

        </div>

        {/* ================================= */}
        {/* RIGHT COLUMN */}
        {/* NORMAL FORM */}
        {/* ================================= */}

        <section className="min-w-0">

          <div className="mb-4">
            <h3 className="text-[15px] font-semibold text-slate-900">
              Driver Information
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter your personal and verification details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">

            {/* FULL NAME */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                value={
                  user?.fullName || ""
                }
                readOnly
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-[13px] text-slate-600 outline-none"
              />
            </div>

            {/* MOBILE */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Mobile Number
              </label>

              <input
                type="tel"
                value={
                  user?.phone || ""
                }
                readOnly
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-[13px] text-slate-600 outline-none"
              />
            </div>

            {/* DOB */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Date of Birth
              </label>

              <input
                type="date"
                value={form.dob}
                onChange={(event) =>
                  updateField(
                    "dob",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* GENDER */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Gender
              </label>

              <select
                value={form.gender}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="">
                  Select gender
                </option>

                <option value="MALE">
                  Male
                </option>

                <option value="FEMALE">
                  Female
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* AADHAAR */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Aadhaar Number
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={12}
                value={form.aadhaar}
                onChange={(event) =>
                  updateField(
                    "aadhaar",
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 12)
                  )
                }
                placeholder="Enter 12-digit Aadhaar"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* LICENCE */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Driving Licence Number
              </label>

              <input
                type="text"
                value={
                  form.licenceNumber
                }
                onChange={(event) =>
                  updateField(
                    "licenceNumber",
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="Enter licence number"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* DISTRICT */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                District
              </label>

              <input
                type="text"
                value={form.district}
                onChange={(event) =>
                  updateField(
                    "district",
                    event.target.value
                  )
                }
                placeholder="Enter district"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* STATE */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                State
              </label>

              <input
                type="text"
                value={form.state}
                onChange={(event) =>
                  updateField(
                    "state",
                    event.target.value
                  )
                }
                placeholder="Enter state"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* PINCODE */}

            <div className="min-w-0">
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Pincode
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={form.pincode}
                onChange={(event) =>
                  updateField(
                    "pincode",
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                placeholder="Enter 6-digit pincode"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

          </div>
        </section>
      </div>

      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div className="mt-6 border-t border-slate-100 pt-5">
        <OnboardingActions
          onCancel={onCancel}
          onBack={onBack}
          onNext={handleNext}
        />
      </div>

    </div>
  );
}