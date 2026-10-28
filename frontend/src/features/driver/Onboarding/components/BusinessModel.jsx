import { useEffect, useState } from "react";
import OnboardingActions from "./OnboardingActions";

const BUSINESS_MODELS = [
  {
    id: "DRIVER_ONLY",
    title: "Driver Only",
    description: "I drive a vehicle owned by someone else",
  },
  {
    id: "OWNER_DRIVER",
    title: "Owner & Driver",
    description: "I own and drive my own vehicle",
  },
  {
    id: "FLEET_OWNER",
    title: "Fleet / Travels Owner",
    description: "I own multiple vehicles and manage drivers",
  },
];

export default function BusinessModel({
  value,
  onChange,
  onNext,
  onCancel,
  onBack,
}) {
  const [selected, setSelected] = useState(value || "");

  // Keep local selection synced with parent onboarding state
  useEffect(() => {
    setSelected(value || "");
  }, [value]);

  const handleSelect = (model) => {
    setSelected(model);

    onChange?.(model);
  };

  const handleNext = () => {
    if (!selected) {
      return;
    }

    onNext?.(selected);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          How do you operate?
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Choose the option that best describes your
          driving business.
        </p>
      </div>

      {/* Business Models */}
      <div className="space-y-3">
        {BUSINESS_MODELS.map((model) => {
          const isSelected = selected === model.id;

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => handleSelect(model.id)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Radio */}
                <div
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-blue-600"
                      : "border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <h3
                    className={`text-base font-semibold ${
                      isSelected
                        ? "text-blue-700"
                        : "text-slate-900"
                    }`}
                  >
                    {model.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {model.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <OnboardingActions
        onCancel={onCancel}
        onBack={onBack}
        onNext={handleNext}
      />
    </div>
  );
}
 