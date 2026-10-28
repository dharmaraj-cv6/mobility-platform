import { useState } from "react";

const documents = [
  {
    key: "profilePhoto",
    title: "Profile Photo",
  },
  {
    key: "aadhaar",
    title: "Aadhaar Card",
  },
  {
    key: "drivingLicence",
    title: "Driving Licence",
  },
  {
    key: "rcBook",
    title: "RC Book",
  },
  {
    key: "insurance",
    title: "Insurance",
  },
  {
    key: "permit",
    title: "Permit",
  },
  {
    key: "fitness",
    title: "Fitness Certificate",
  },
  {
    key: "pollution",
    title: "Pollution Certificate",
  },
];

export default function UploadDocuments({
    data,
    updateData,
    next,
    previous,
}) {

    const [files, setFiles] = useState(data.documents || {});

    const handleFile = (key, file) => {

        if (!file) return;

        setFiles(prev => ({
            ...prev,
            [key]: file,
        }));

    };

    const submit = () => {

        updateData({
            documents: files,
        });

        next();

    };

    return (

        <div className="space-y-8">

            <div>

                <h2 className="text-2xl font-bold">
                    Upload Documents
                </h2>

                <p className="text-gray-500">
                    JPG, PNG or PDF (Max 5 MB)
                </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {documents.map((doc) => (

                    <DocumentCard
                        key={doc.key}
                        title={doc.title}
                        file={files[doc.key]}
                        onChange={(file) =>
                            handleFile(doc.key, file)
                        }
                    />

                ))}

            </div>

            <div className="flex justify-between">

                <button
                    onClick={previous}
                    className="border rounded-lg px-6 py-3"
                >
                    Back
                </button>

                <button
                    onClick={submit}
                    className="bg-primary text-white rounded-lg px-6 py-3"
                >
                    Continue
                </button>

            </div>

        </div>

    );

}

function DocumentCard({
    title,
    file,
    onChange,
}) {

    return (

        <div className="rounded-xl border p-5">

            <h3 className="font-semibold">
                {title}
            </h3>

            <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="mt-4"
                onChange={(e) =>
                    onChange(e.target.files[0])
                }
            />

            {file && (

                <div className="mt-3 text-green-600">

                    ✔ {file.name}

                </div>

            )}

        </div>

    );

}