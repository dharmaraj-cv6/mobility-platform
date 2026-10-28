export default function Spinner({
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={[
        "animate-spin rounded-full",
        "border-2 border-neutral-200",
        "border-t-primary-600",
        sizes[size],
        className,
      ].join(" ")}
    />
  );
}