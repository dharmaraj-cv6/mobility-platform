import { useEffect, useState } from "react";

import OnboardingActions from "./OnboardingActions";

const DRIVER_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "Aadhaar Card",
    documentType: "AADHAAR",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
  },
  {
    key: "drivingLicence",
    label: "Driving Licence",
    documentType: "DRIVING_LICENSE",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
  },
  {
    key: "profilePhoto",
    label: "Profile Photo",
    documentType: "PROFILE_PHOTO",
    accept: ".jpg,.jpeg,.png,.webp",
  },
];

const VEHICLE_DOCUMENTS = [
  {
    key: "vehiclePhoto",
    label: "Vehicle Photo",
    documentType: "VEHICLE_PHOTO",
    accept: ".jpg,.jpeg,.png,.webp",
  },
  {
    key: "rcBook",
    label: "RC Book",
    documentType: "RC_BOOK",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
  },
  {
    key: "insurance",
    label: "Insurance",
    documentType: "INSURANCE",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
  },
  {
    key: "permit",
    label: "Permit",
    documentType: "PERMIT",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
  },
  {
    key: "fitness",
    label: "Fitness Certificate",
    documentType: "FITNESS",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
  },
  {
    key: "pollution",
    label: "Pollution Certificate",
    documentType: "POLLUTION",
    accept: ".jpg,.jpeg,.png,.webp,.pdf",
  },
];

export default function DocumentUpload({
  initialDocuments = {},
  onBack,
  onNext,
  onCancel,
}) {
  const [documents, setDocuments] =
    useState(initialDocuments);

  useEffect(() => {
    setDocuments(initialDocuments || {});
  }, [initialDocuments]);

  const handleFileChange = (
    key,
    file
  ) => {
    if (!file) {
      return;
    }

    setDocuments((previous) => ({
      ...previous,
      [key]: file,
    }));
  };

  const handleNext = () => {
    const driverDocuments =
      DRIVER_DOCUMENTS.map(
        (document) => {
          const file =
            documents[
              document.key
            ];

          if (!file) {
            return null;
          }

          return {
            documentType:
              document.documentType,
            file,
          };
        }
      ).filter(Boolean);

    const vehicleDocuments =
      VEHICLE_DOCUMENTS.map(
        (document) => {
          const file =
            documents[
              document.key
            ];

          if (!file) {
            return null;
          }

          return {
            documentType:
              document.documentType,
            file,
          };
        }
      ).filter(Boolean);

    onNext({
      ...documents,
      driverDocuments,
      vehicleDocuments,
    });
  };

  const renderDocumentInput = (
    document
  ) => {
    const selectedFile =
      documents[
        document.key
      ];

    return (
      <DocumentCard
        key={document.key}
        document={document}
        selectedFile={selectedFile}
        onFileChange={
          handleFileChange
        }
      />
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 p-6">

      {/* HEADER */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Documents & KYC
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Upload your driver and vehicle
          documents for verification.
        </p>
      </div>

      {/* DRIVER DOCUMENTS */}

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Driver Documents
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Your profile photo, Aadhaar and
            driving licence are used for driver
            verification.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {DRIVER_DOCUMENTS.map(
            renderDocumentInput
          )}
        </div>
      </section>

      {/* VEHICLE DOCUMENTS */}

      <section className="mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Vehicle Documents
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Vehicle photo and registration
            documents are reviewed with your
            vehicle details.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {VEHICLE_DOCUMENTS.map(
            renderDocumentInput
          )}
        </div>
      </section>

      {/* ACTIONS */}

      <OnboardingActions
        onCancel={onCancel}
        onBack={onBack}
        onNext={handleNext}
        nextLabel="Review"
      />
    </div>
  );
}

function DocumentCard({
  document,
  selectedFile,
  onFileChange,
}) {
  const previewUrl =
    usePreviewUrl(selectedFile);

  const imagePreview =
    Boolean(
      previewUrl &&
        isImageFile(
          selectedFile?.name
        )
    );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">

      <label className="block">

        <span className="text-sm font-semibold text-slate-800">
          {document.label}
        </span>

        <input
          type="file"
          accept={
            document.accept
          }
          className="mt-3 block w-full text-sm text-slate-600"
          onChange={(event) =>
            onFileChange(
              document.key,
              event.target.files?.[0]
            )
          }
        />

        {selectedFile && (
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">

              {imagePreview ? (
                <img
                  src={previewUrl}
                  alt={
                    document.label
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  PDF
                </span>
              )}

            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-700">
                Selected
              </p>

              <p className="truncate text-xs text-emerald-600">
                {selectedFile.name}
              </p>
            </div>

          </div>
        )}

      </label>
    </div>
  );
}

function usePreviewUrl(file) {
  const [previewUrl, setPreviewUrl] =
    useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    if (
      typeof file === "string"
    ) {
      setPreviewUrl(file);
      return undefined;
    }

    if (
      typeof File !== "undefined" &&
      file instanceof File
    ) {
      const url =
        URL.createObjectURL(
          file
        );

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    setPreviewUrl("");
    return undefined;
  }, [file]);

  return previewUrl;
}

function isImageFile(fileName) {
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
