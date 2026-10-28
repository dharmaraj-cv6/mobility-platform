import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",

  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300",

  outline:
    "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",

  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100",

  destructive:
    "bg-error-600 text-white hover:bg-error-700",

  success:
    "bg-success-600 text-white hover:bg-success-700",

  link:
    "bg-transparent text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline",
};

const sizes = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-3.5 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  xl: "h-14 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        "inline-flex",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-md",
        "font-semibold",
        "transition-colors",
        "duration-200",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-primary-600",
        "disabled:pointer-events-none",
        "disabled:opacity-50",

        variants[variant],
        sizes[size],

        fullWidth ? "w-full" : "",

        className,
      ].join(" ")}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

      {!loading && leftIcon && leftIcon}

      {children}

      {!loading && rightIcon && rightIcon}
    </button>
  );
}