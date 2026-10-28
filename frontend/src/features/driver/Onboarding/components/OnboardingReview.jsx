import { useEffect, useState } from "react";

import OnboardingActions from "./OnboardingActions";

export default function OnboardingReview({
  onboardingData,
  user,
  onBack,
  onSubmit,
  submitting,
  onCancel,
}) {
  const driverVehicle =
    onboardingData?.driverVehicle || {};

  const driver =
    driverVehicle.driver ||
    onboardingData?.driver ||
    driverVehicle;

  const vehicle =
    driverVehicle.vehicle ||
    onboardingData?.vehicle ||
    driverVehicle;

  const documents =
    onboardingData?.documents || {};

  const driverDocuments =
    documents.driverDocuments || [];

  const vehicleDocuments =
    documents.vehicleDocuments || [];

  // Driver / vehicle photos are now part of
  // the common onboarding document flow.
  const driverPhoto =
    documents.profilePhoto ||
    driver?.image ||
    null;

  const vehiclePhoto =
    documents.vehiclePhoto ||
    vehicle?.image ||
    null;

  return (
    <div className="w-full">

      {/* HEADER */}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Review & Confirmation
        </h2>

        <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-[13px]">
          Check your driver, vehicle and
          document information before
          submitting.
        </p>
      </div>

      {/* ================================= */}
      {/* BUSINESS */}
      {/* ================================= */}

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-3">
          <h3 className="text-[15px] font-semibold text-slate-900">
            Business Model
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Selected business service
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 px-3.5 py-3">
          <p className="text-[13px] font-medium text-slate-800">
            {onboardingData?.businessModel ||
              "-"}
          </p>
        </div>
      </section>

      {/* ================================= */}
      {/* VEHICLE */}
      {/* ================================= */}

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">
              Vehicle Details
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Vehicle information submitted
              for verification
            </p>
          </div>

          <ReviewImage
            src={vehiclePhoto}
            alt="Vehicle"
            label="Vehicle Photo"
          />

        </div>

        <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">

          <Info
            label="Type"
            value={
              vehicle?.vehicleType
            }
          />

          <Info
            label="Brand"
            value={
              vehicle?.brand
            }
          />

          <Info
            label="Model"
            value={
              vehicle?.model
            }
          />

          <Info
            label="Registration"
            value={
              vehicle?.registrationNumber ||
              vehicle?.vehicleNumber
            }
          />

          <Info
            label="Seats"
            value={
              vehicle?.seatCapacity ||
              vehicle?.seatingCapacity
            }
          />

          <Info
            label="Fuel"
            value={
              vehicle?.fuelType
            }
          />

          <Info
            label="Manufacturing Year"
            value={
              vehicle?.manufacturingYear ||
              vehicle?.year
            }
          />

          <Info
            label="Color"
            value={
              vehicle?.color ||
              vehicle?.colour
            }
          />

        </div>
      </section>

      {/* ================================= */}
      {/* DRIVER */}
      {/* ================================= */}

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">
              Driver Details
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Personal and verification
              information
            </p>
          </div>

          <ReviewImage
            src={driverPhoto}
            alt="Driver"
            label="Driver Photo"
          />

        </div>

        <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">

          <Info
            label="Full Name"
            value={
              driver?.fullName
            }
          />

          <Info
            label="Mobile Number"
            value={
              driver?.phone
            }
          />

          <Info
            label="Date of Birth"
            value={
              driver?.dob
            }
          />

          <Info
            label="Gender"
            value={
              driver?.gender
            }
          />

          <Info
            label="Aadhaar"
            value={
              driver?.aadhaar
            }
          />

          <Info
            label="Licence Number"
            value={
              driver?.licenceNumber ||
              driver?.licenseNumber
            }
          />

          <Info
            label="District"
            value={
              driver?.district
            }
          />

          <Info
            label="State"
            value={
              driver?.state
            }
          />

          <Info
            label="Pincode"
            value={
              driver?.pincode
            }
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <Info
              label="Address"
              value={
                driver?.address
              }
            />
          </div>

        </div>
      </section>

      {/* ================================= */}
      {/* DRIVER DOCUMENTS */}
      {/* ================================= */}

      <DocumentReviewSection
        title="Driver Documents"
        description="These documents will be submitted for driver verification."
        documents={
          driverDocuments
        }
      />

      {/* ================================= */}
      {/* VEHICLE DOCUMENTS */}
      {/* ================================= */}

      <DocumentReviewSection
        title="Vehicle Documents"
        description="These documents will be submitted for vehicle verification."
        documents={
          vehicleDocuments
        }
      />

      {/* ================================= */}
      {/* VERIFICATION */}
      {/* ================================= */}

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

        <p className="text-[13px] font-semibold text-amber-900">
          Verification
        </p>

        <p className="mt-1 text-xs leading-5 text-amber-700">
          Your driver profile, vehicle,
          photos and submitted documents
          will be reviewed after submission.
        </p>

      </div>

      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div className="mt-6 border-t border-slate-100 pt-5">

        <OnboardingActions
          onCancel={onCancel}
          onBack={() =>
            onBack("documents")
          }
          onNext={onSubmit}
          nextLabel={
            submitting
              ? "Submitting..."
              : "Submit for Verification"
          }
          nextDisabled={
            submitting
          }
        />

      </div>

    </div>
  );
}

/* ================================================= */
/* DOCUMENT REVIEW SECTION */
/* ================================================= */

function DocumentReviewSection({
  title,
  description,
  documents = [],
}) {
  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">

      <div>
        <h3 className="text-[15px] font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      {documents.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">

          {documents.map(
            (document, index) => (
              <DocumentPreview
                key={`${document.documentType}-${index}`}
                document={
                  document
                }
              />
            )
          )}

        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-slate-50 px-3.5 py-3">
          <p className="text-[13px] text-slate-500">
            No documents selected.
          </p>
        </div>
      )}

    </section>
  );
}

/* ================================================= */
/* DOCUMENT PREVIEW */
/* ================================================= */

function DocumentPreview({
  document,
}) {
  const file =
    document?.file;

  const previewUrl =
    usePreviewUrl(file);

  const fileName =
    file?.name ||
    getFileName(
      document?.fileUrl
    );

  const imagePreview =
    Boolean(
      previewUrl &&
      isImageFile(fileName)
    );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">

      <div className="flex items-start gap-3">

        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">

          {imagePreview ? (
            <img
              src={previewUrl}
              alt={
                document?.documentType ||
                "Document"
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold uppercase text-slate-400">
              {isPdfFile(fileName)
                ? "PDF"
                : "FILE"}
            </span>
          )}

        </div>

        <div className="min-w-0 flex-1">

          <p className="text-xs font-semibold text-slate-800">
            {formatDocumentType(
              document?.documentType
            )}
          </p>

          <p className="mt-1 truncate text-[11px] text-slate-400">
            {fileName}
          </p>

          <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
            Ready to upload
          </span>

        </div>

      </div>

    </div>
  );
}

/* ================================================= */
/* REVIEW IMAGE */
/* ================================================= */

function ReviewImage({
  src,
  alt,
  label,
}) {
  const previewUrl =
    usePreviewUrl(src);

  return (
    <div className="flex shrink-0 items-center gap-3">

      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

        {previewUrl &&
        isImageFile(
          getFileName(src)
        ) ? (
          <img
            src={previewUrl}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="px-1 text-center text-[10px] text-slate-400">
            No photo
          </span>
        )}

      </div>

      <p className="text-[11px] font-medium text-slate-400">
        {label}
      </p>

    </div>
  );
}

/* ================================================= */
/* PREVIEW URL */
/* ================================================= */

function usePreviewUrl(value) {
  const [url, setUrl] =
    useState("");

  useEffect(() => {
    if (!value) {
      setUrl("");
      return undefined;
    }

    if (
      typeof value === "string"
    ) {
      setUrl(value);
      return undefined;
    }

    if (
      typeof File !== "undefined" &&
      value instanceof File
    ) {
      const objectUrl =
        URL.createObjectURL(
          value
        );

      setUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(
          objectUrl
        );
      };
    }

    setUrl("");
    return undefined;
  }, [value]);

  return url;
}

/* ================================================= */
/* INFO */
/* ================================================= */

function Info({
  label,
  value,
}) {
  return (
    <div className="min-w-0">

      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-[13px] font-medium text-slate-800">
        {value || "-"}
      </p>

    </div>
  );
}

/* ================================================= */
/* HELPERS */
/* ================================================= */

function isImageFile(
  fileName
) {
  if (!fileName) {
    return false;
  }

  const value =
    String(fileName).toLowerCase();

  return (
    value.endsWith(".jpg") ||
    value.endsWith(".jpeg") ||
    value.endsWith(".png") ||
    value.endsWith(".webp") ||
    value.endsWith(".gif")
  );
}

function isPdfFile(
  fileName
) {
  if (!fileName) {
    return false;
  }

  return String(
    fileName
  )
    .toLowerCase()
    .endsWith(".pdf");
}

function getFileName(
  value
) {
  if (!value) {
    return "Document selected";
  }

  if (
    typeof value === "object" &&
    value.name
  ) {
    return value.name;
  }

  const cleanUrl =
    String(value).split("?")[0];

  return (
    cleanUrl.split("/").pop() ||
    "Document selected"
  );
}

function formatDocumentType(
  value
) {
  if (!value) {
    return "Document";
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}
