export default function OnboardingActions({
  onCancel,
  onBack,
  onNext,
  nextLabel = "Next",
  showBack = true,
  nextDisabled = false,
}) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 pt-6">

      {/* Cancel */}

      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-semibold text-slate-500 transition hover:text-red-600"
      >
        Cancel Onboarding
      </button>

      {/* Actions */}

      <div className="flex items-center gap-3">

        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="h-12 rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="h-12 rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel}
        </button>

      </div>

    </div>
  );
}