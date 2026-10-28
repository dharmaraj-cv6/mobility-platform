import { useNavigate } from "react-router-dom";

import vehicles from "../../../data/vehicles";

export default function BookNow() {
  const navigate = useNavigate();

  /*
   * One suggested driver for each vehicle type.
   * We do NOT show the complete driver list.
   */
  const suggestedDrivers = [];

  const usedVehicles = new Set();

  for (const vehicle of vehicles) {
    if (usedVehicles.has(vehicle.vehicle)) {
      continue;
    }

    usedVehicles.add(vehicle.vehicle);
    suggestedDrivers.push(vehicle);
  }

  /*
   * Only show a small number of vehicle suggestions
   * on Home. The complete list belongs to Booking.
   */
  const suggestions = suggestedDrivers.slice(0, 3);

  const handleDriverClick = (driver) => {
    navigate("/booking", {
      state: {
        service: "city",
        rideType: "bookNow",
        vehicle: driver.vehicle,
        suggestedDriver: driver,
        entry: "suggested-driver",
      },
    });
  };

  const handleDestinationClick = () => {
    navigate("/booking", {
      state: {
        service: "city",
        rideType: "bookNow",
        entry: "destination",
      },
    });
  };

  return (
    <div className="feature-content">

      {/* =================================================
          DEMAND INDICATOR
      ================================================== */}

      <div className="demand-indicator">

        <span className="demand-indicator__icon">
          ●
        </span>

        <div>
          <p className="demand-indicator__title">
            Vehicles available nearby
          </p>

          <p className="demand-indicator__description">
            Availability may change based on demand
          </p>
        </div>

      </div>


      {/* =================================================
          VEHICLE TYPE
      ================================================== */}

      <div className="section-header">

        <h3 className="section-title">
          Vehicle type
        </h3>

        <p className="section-description">
          Choose a comfortable vehicle
        </p>

      </div>


      <div className="vehicle-options">

        {suggestions.map((driver) => (

          <button
            key={driver.vehicle}
            type="button"
            className="vehicle-option"
            onClick={() =>
              handleDriverClick(driver)
            }
          >

            <span className="vehicle-option__icon">
              🚕
            </span>

            <span className="vehicle-option__label">
              {driver.vehicle}
            </span>

          </button>

        ))}

        {suggestedDrivers.length > 3 && (
          <button
            type="button"
            className="vehicle-option"
            onClick={handleDestinationClick}
          >

            <span className="vehicle-option__icon">
              +
            </span>

            <span className="vehicle-option__label">
              More
            </span>

          </button>
        )}

      </div>


      {/* =================================================
          SUGGESTED DRIVERS
      ================================================== */}

      <div className="section-header">

        <h3 className="section-title">
          Suggested drivers
        </h3>

        <p className="section-description">
          One suggestion for each vehicle type
        </p>

      </div>


      <div className="suggested-driver-list">

        {suggestions.map((driver) => (

          <button
            key={driver.vehicle}
            type="button"
            className="suggested-driver-card"
            onClick={() =>
              handleDriverClick(driver)
            }
          >

            {/* Driver avatar */}

            <div className="suggested-driver-card__avatar">
              👤
            </div>


            {/* Driver information */}

            <div className="suggested-driver-card__content">

              <div className="suggested-driver-card__title">

                <strong>
                  {driver.driver}
                </strong>

                {driver.rating && (
                  <span>
                    ★ {driver.rating}
                  </span>
                )}

              </div>


              <p>
                {driver.business}
              </p>


              <small>
                {driver.vehicle}
                {driver.distance && (
                  <> · {driver.distance}</>
                )}
                {driver.eta && (
                  <> · {driver.eta}</>
                )}
              </small>

            </div>


            {/* Fare */}

            <div className="suggested-driver-card__fare">

              <small>
                Est. fare
              </small>

              <strong>
                ₹{driver.fare}
              </strong>

            </div>

          </button>

        ))}

      </div>


      {/* =================================================
          DESTINATION
      ================================================== */}

      <div className="section-header">

        <h3 className="section-title">
          Destination
        </h3>

        <p className="section-description">
          Choose where you want to go
        </p>

      </div>


      <button
        type="button"
        className="destination-entry"
        onClick={handleDestinationClick}
      >

        <span className="destination-entry__icon">
          📍
        </span>

        <span className="destination-entry__text">
          Where do you want to go?
        </span>

        <span className="destination-entry__arrow">
          →
        </span>

      </button>

    </div>
  );
}