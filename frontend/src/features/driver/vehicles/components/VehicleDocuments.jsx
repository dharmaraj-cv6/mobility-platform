export default function VehicleDocuments({
  documents,
  onDocumentChange,
}) {
  const documentItems = [
    {
      key: "rc",
      title: "Registration Certificate",
      shortTitle: "RC",
      description:
        "Upload the vehicle registration certificate.",
      required: true,
    },
    {
      key: "insurance",
      title: "Vehicle Insurance",
      shortTitle: "Insurance",
      description:
        "Upload the current vehicle insurance document.",
      required: true,
    },
    {
      key: "fitness",
      title: "Fitness Certificate",
      shortTitle: "Fitness",
      description:
        "Upload the valid fitness certificate.",
      required: false,
    },
    {
      key: "permit",
      title: "Permit",
      shortTitle: "Permit",
      description:
        "Upload the applicable vehicle permit.",
      required: false,
    },
    {
      key: "other",
      title: "Other Document",
      shortTitle: "Other",
      description:
        "Upload any additional vehicle document.",
      required: false,
    },
  ];

  const handleFileChange = (
    documentType,
    event
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onDocumentChange(
      documentType,
      file
    );
  };

  return (
    <section>

      {/* Header */}

      <div className="mb-5">

        <h3 className="text-base font-bold text-slate-900">
          Vehicle Documents
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Upload clear and valid documents for
          vehicle verification.
        </p>

      </div>


      {/* Documents */}

      <div className="grid gap-4 md:grid-cols-2">

        {documentItems.map(
          (document) => {

            const file =
              documents?.[
                document.key
              ];

            return (
              <div
                key={document.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >

                {/* Title */}

                <div className="mb-3 flex items-start justify-between gap-3">

                  <div>

                    <div className="flex items-center gap-2">

                      <h4 className="text-sm font-semibold text-slate-800">
                        {document.title}
                      </h4>

                      {document.required && (
                        <span className="text-xs font-semibold text-red-500">
                          Required
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {document.description}
                    </p>

                  </div>

                </div>


                {/* Upload */}

                <label
                  className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white px-4 py-4 text-center transition ${
                    file
                      ? "border-green-300 bg-green-50/40"
                      : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30"
                  }`}
                >

                  {file ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg text-green-600">
                        ✓
                      </div>

                      <p className="mt-2 max-w-full truncate text-xs font-semibold text-green-700">
                        {file.name}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
                        📄
                      </div>

                      <p className="mt-2 text-xs font-semibold text-slate-700">
                        Upload {document.shortTitle}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        PDF, JPG, PNG · Max 5MB
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(event) =>
                      handleFileChange(
                        document.key,
                        event
                      )
                    }
                  />

                </label>

              </div>
            );
          }
        )}

      </div>


      {/* Information */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

        <div className="flex gap-3">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
            i
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              Document requirements
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Make sure the documents are clear,
              readable, valid and belong to the
              registered vehicle. Documents will be
              reviewed during verification.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}