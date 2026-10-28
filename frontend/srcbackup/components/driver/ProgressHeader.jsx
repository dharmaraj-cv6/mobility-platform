const ProgressHeader = ({ title, subtitle, step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-8">
      <p className="text-sm text-blue-600 font-medium">
        Step {step} of {totalSteps}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {title}
      </h2>

      <p className="text-gray-500 mt-2">
        {subtitle}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressHeader;