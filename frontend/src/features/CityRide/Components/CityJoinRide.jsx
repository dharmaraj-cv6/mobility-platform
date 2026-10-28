import LiveCoRideCard from "./LiveJoinaRideCard";

const liveRides = [
  {
    id: 1,
    destination: "Gandhipuram",
    reachTime: "9:20 AM",
    reservedSeats: 2,
    availableSeats: 1,
    requestedBy: "Female",
    vehicle: "Cab",
  },
  {
    id: 2,
    destination: "RS Puram",
    reachTime: "10:05 AM",
    reservedSeats: 1,
    availableSeats: 2,
    requestedBy: "Male",
    vehicle: "Auto",
  },
];

export default function JoinRide() {
  return (
    <div className="feature-content">

      <div className="section-header">
        <h3 className="section-title">
          Live rides
        </h3>

        <p className="section-description">
          Find a ride going your way
        </p>
      </div>


      <div className="live-ride-list">

        {liveRides.map((ride) => (
          <LiveCoRideCard
            key={ride.id}
            ride={ride}
          />
        ))}

      </div>


      <div className="empty-action">

        <p className="section-description">
          Can't find a suitable ride?
        </p>

        <button
          type="button"
          className="secondary-button"
        >
          Create a new ride
        </button>

      </div>

    </div>
  );
}