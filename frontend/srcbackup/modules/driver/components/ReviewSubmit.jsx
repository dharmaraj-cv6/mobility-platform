export default function ReviewSubmit({
    data,
    previous,
    submitRegistration,
    loading,
}) {
    return (
        <div className="space-y-8">

            <div>
                <h2 className="text-2xl font-bold">
                    Review Registration
                </h2>

                <p className="text-gray-500">
                    Verify your information before submitting.
                </p>
            </div>

            {/* Personal Details */}

            <Section title="Personal Details">

                <Row label="Full Name" value={data.fullName} />
                <Row label="Mobile" value={data.mobile} />
                <Row label="Email" value={data.email} />
                <Row label="DOB" value={data.dob} />
                <Row label="Gender" value={data.gender} />
                <Row label="Aadhaar" value={data.aadhaar} />
                <Row label="Driving Licence" value={data.licenceNumber} />

            </Section>

            {/* Experience */}

            <Section title="Driving Experience">

                <Row
                    label="Experience"
                    value={data.experience}
                />

                <Row
                    label="Worked Platforms"
                    value={data.workedPlatforms?.join(", ")}
                />

                <Row
                    label="Languages"
                    value={data.languages?.join(", ")}
                />

            </Section>

            {/* Business */}

            <Section title="Business Type">

                <Row
                    label="Business"
                    value={data.businessType}
                />

            </Section>

            {/* Vehicle */}

            <Section title="Vehicle Details">

                <Row
                    label="Vehicle Type"
                    value={data.vehicleType}
                />

                <Row
                    label="Brand"
                    value={data.brand}
                />

                <Row
                    label="Model"
                    value={data.model}
                />

                <Row
                    label="Registration No"
                    value={data.registrationNumber}
                />

                <Row
                    label="Fuel"
                    value={data.fuelType}
                />

                <Row
                    label="Seats"
                    value={data.seatCapacity}
                />

                <Row
                    label="Color"
                    value={data.color}
                />

            </Section>

            {/* Documents */}

            <Section title="Uploaded Documents">

                {Object.entries(data.documents || {}).map(
                    ([key, file]) => (
                        <Row
                            key={key}
                            label={key}
                            value={file?.name}
                        />
                    )
                )}

            </Section>

            <div className="flex justify-between">

                <button
                    onClick={previous}
                    className="rounded-lg border px-6 py-3"
                >
                    Back
                </button>

                <button
                    onClick={submitRegistration}
                    disabled={loading}
                    className="rounded-lg bg-primary px-6 py-3 text-white"
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Registration"}
                </button>

            </div>

        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="rounded-xl border p-6">
            <h3 className="mb-5 text-lg font-semibold">
                {title}
            </h3>

            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

function Row({
    label,
    value,
}) {
    return (
        <div className="flex justify-between border-b pb-2">

            <span className="font-medium">
                {label}
            </span>

            <span>
                {value || "-"}
            </span>

        </div>
    );
}