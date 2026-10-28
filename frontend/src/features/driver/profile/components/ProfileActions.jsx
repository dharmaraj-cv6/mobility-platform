import { useNavigate } from "react-router-dom";

export default function ProfileActions() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <button
        className="rounded-2xl border px-6 py-4 font-semibold transition hover:shadow-md"
        onClick={() => navigate("/driver/register")}
      >
        Edit Profile
      </button>

      <button
        className="rounded-2xl border px-6 py-4 font-semibold transition hover:shadow-md"
        onClick={() => navigate("/driver/dashboard")}
      >
        Driver Dashboard
      </button>
    </div>
  );
}