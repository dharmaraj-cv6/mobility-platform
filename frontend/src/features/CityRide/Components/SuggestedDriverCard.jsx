const suggestedDrivers = [
  {
    vehicle: "Auto",
    driver: "Ravi Kumar",
    business: "Coimbatore Auto Ride",
    rating: "4.8",
    distance: "1.2 km",
    eta: "3 min",
    fare: "₹120",
  },
  {
    vehicle: "Cab",
    driver: "Suresh",
    business: "Suresh Cab Services",
    rating: "4.9",
    distance: "1.8 km",
    eta: "4 min",
    fare: "₹180",
  },
  {
    vehicle: "Premium",
    driver: "Kumar Travels",
    business: "Kumar Travels",
    rating: "4.8",
    distance: "2.4 km",
    eta: "5 min",
    fare: "₹260",
  },
];

export default function SuggestedDriverCard() {
  return (
    <div className="suggested-driver-list">

      {suggestedDrivers.map((driver) => (

        <button
          key={driver.vehicle}
          type="button"
          className="suggested-driver-card"
        >

          <div className="suggested-driver-card__avatar">
            👤
          </div>


          <div className="suggested-driver-card__content">

            <div className="suggested-driver-card__title">

              <strong>
                {driver.driver}
              </strong>

              <span>
                ★ {driver.rating}
              </span>

            </div>

            <p>
              {driver.business}
            </p>

            <small>
              {driver.vehicle}
              {" · "}
              {driver.distance}
              {" · "}
              {driver.eta}
            </small>

          </div>


          <div className="suggested-driver-card__fare">

            <small>
              Est. fare
            </small>

            <strong>
              {driver.fare}
            </strong>

          </div>

        </button>

      ))}

    </div>
  );
}