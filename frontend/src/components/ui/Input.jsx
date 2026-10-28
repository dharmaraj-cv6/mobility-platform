import { AlertCircle } from "lucide-react";

export default function Input({
  label,
  error,
  helperText,
  required = false,
  className = "",
  id,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-error-600">*</span>
          )}
        </label>
      )}

      <input
        id={id}
        className={[
          "h-10 w-full rounded-md border bg-white px-3",
          "text-sm text-neutral-900",
          "placeholder:text-neutral-400",
          "transition-colors",

          "focus:border-primary-600",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-primary-100",

          "disabled:cursor-not-allowed",
          "disabled:bg-neutral-100",
          "disabled:text-neutral-500",

          error
            ? "border-error-500 focus:border-error-500 focus:ring-error-100"
            : "border-neutral-300",

          className,
        ].join(" ")}
        {...props}
      />

      {error ? (
        <div className="mt-1.5 flex items-center gap-1 text-xs text-error-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-neutral-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}