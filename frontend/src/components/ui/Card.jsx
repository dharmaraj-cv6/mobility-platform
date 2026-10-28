export default function Card({
  children,
  padding = "md",
  hover = false,
  selected = false,
  className = "",
}) {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={[
        "rounded-lg border bg-white",
        "border-neutral-200",

        paddingStyles[padding],

        hover
          ? "cursor-pointer transition-shadow duration-200 hover:shadow-md"
          : "",

        selected
          ? "border-primary-600 ring-2 ring-primary-100"
          : "",

        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}