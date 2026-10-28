export default function LiveCoRideCard({
  ride,
}) {
  return (
    <article className="live-ride-card">

      <div className="live-ride-card__header">

        <div>
          <span className="card-label">
            Destination
          </span>

          <h3 className="card-title">
            {ride.destination}
          </h3>
        </div>

        <span className="status">
          Live
        </span>

      </div>


      <div className="live-ride-card__details">

        <div>
          <span>
            Reach by
          </span>

          <strong>
            {ride.reachTime}
          </strong>
        </div>

        <div>
          <span>
            Reserved
          </span>

          <strong>
            {ride.reservedSeats}
          </strong>
        </div>

        <div>
          <span>
            Available
          </span>

          <strong>
            {ride.availableSeats}
          </strong>
        </div>

      </div>


      <div className="live-ride-card__meta">

        <span>
          {ride.vehicle}
        </span>

        <span>
          Ride owner: {ride.requestedBy}
        </span>

      </div>


      <button
        type="button"
        className="primary-button"
      >
        Request to Join
      </button>

    </article>
  );
}