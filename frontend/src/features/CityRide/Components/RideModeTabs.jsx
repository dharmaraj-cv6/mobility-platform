export default function RideModeTabs({
  modes,
  activeMode,
  onModeChange,
}) {
  return (
    <div className="ride-mode-tabs">

      {modes.map((mode) => {

        const isActive =
          activeMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() =>
              onModeChange(mode.id)
            }
            className={`ride-mode-tab ${
              isActive
                ? "ride-mode-tab--active"
                : ""
            }`}
          >
            {mode.label}
          </button>
        );
      })}

    </div>
  );
}