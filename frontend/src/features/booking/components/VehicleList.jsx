import vehicles from "../data/vehicles";

export default function DriverList({
  activeVehicle,
  selectedDriver,
  onDriverSelect,
}) {
  const filteredVehicles =
    activeVehicle === "All"
      ? vehicles
      : vehicles.filter(
          (vehicle) => vehicle.vehicle === activeVehicle
        );

  if (!filteredVehicles.length) {
    return (
      <div className="empty-state">
        <p className="body-small">
          No nearby drivers available for this vehicle.
        </p>
      </div>
    );
  }

  return (
    <div className="driver-list">

      {filteredVehicles.map((driver, index) => {
        const isSelected =
          selectedDriver?.id
            ? selectedDriver.id === driver.id
            : selectedDriver === driver;

        return (
          <article
            key={driver.id || index}
            className={`driver-card ${
              isSelected ? "driver-card--selected" : ""
            }`}
          >

            <div className="driver-card__main">

              {/* Driver */}
              <div className="driver-card__avatar">
                {driver.image ? (
                  <img
                    src={driver.image}
                    alt={driver.driver}
                  />
                ) : (
                  "👤"
                )}
              </div>


              {/* Details */}
              <div className="driver-card__info">

                <div className="driver-card__name">

                  <h3>
                    {driver.business || driver.driver}
                  </h3>

                  <span className="driver-card__rating">
                    ★ {driver.rating || "4.8"}
                  </span>

                </div>

                <p className="driver-card__driver">
                  {driver.driver}
                </p>

                <div className="driver-card__meta">

                  <span>
                    {driver.vehicle}
                  </span>

                  <span>
                    📍 {driver.distance}
                  </span>

                  <span>
                    🕐 {driver.eta}
                  </span>

                </div>

              </div>


              {/* Fare */}
              <div className="driver-card__fare">

                <span>
                  Est. fare
                </span>

                <strong>
                  ₹{driver.fare}
                </strong>

                {driver.perKm && (
                  <small>
                    ₹{driver.perKm}/km
                  </small>
                )}

              </div>


              {/* Select */}
              <button
                type="button"
                onClick={() => onDriverSelect(driver)}
                className={
                  isSelected
                    ? "secondary-button"
                    : "primary-button"
                }
              >
                {isSelected
                  ? "Selected"
                  : "Select"}
              </button>

            </div>

          </article>
        );
      })}

    </div>
  );
}