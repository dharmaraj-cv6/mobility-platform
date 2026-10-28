const RegisterButtons = ({
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep,
}) => {
  return (
    <div className="flex justify-between mt-8">

      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className="px-6 py-3 rounded-lg border disabled:opacity-40"
      >
        Previous
      </button>

      <button
        onClick={onNext}
        className="px-6 py-3 rounded-lg bg-blue-600 text-white"
      >
        {isLastStep ? "Create Account" : "Next"}
      </button>

    </div>
  );
};

export default RegisterButtons;