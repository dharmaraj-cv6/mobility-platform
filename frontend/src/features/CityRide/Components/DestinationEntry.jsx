import { useNavigate } from "react-router-dom";

export default function DestinationEntry() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/booking", {
      state: {
        service: "city",
      },
    });
  };

  return (
    <button
      type="button"
      className="destination-entry"
      onClick={handleClick}
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
  );
}