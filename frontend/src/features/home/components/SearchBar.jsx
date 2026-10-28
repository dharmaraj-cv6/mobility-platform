import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const suggestions = [
  "Coimbatore International Airport",
  "Gandhipuram",
  "Ganapathy",
  "Ganapathy Bus Stand",
  "Coimbatore Railway Station",
  "Brookefields Mall",
  "Saravanampatti",
  "RS Puram",
  "Saibaba Colony",
  "Singanallur",
  "Ukkadam",
];

export default function DestinationSearch() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const value = search.trim().toLowerCase();

    // Less than 3 characters = no suggestions
    if (value.length < 3) {
      setFiltered([]);
      return;
    }

    // Related matching + maximum 3 results
    const results = suggestions
      .filter((item) =>
        item.toLowerCase().includes(value)
      )
      .slice(0, 3);

    setFiltered(results);
  }, [search]);

  const selectDestination = (destination) => {
    navigate("/booking", {
      state: {
        destination,
      },
    });
  };

  return (
    <div className="rounded-3xl border p-4">
      <input
        type="text"
        placeholder="Where do you want to go?"
        className="w-full rounded-xl border p-3"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {search.trim().length >= 3 &&
        filtered.length > 0 && (
          <div className="mt-4 space-y-2">
            {filtered.map((item) => (
              <button
                key={item}
                type="button"
                className="block w-full rounded-xl border p-3 text-left hover:bg-gray-50"
                onClick={() =>
                  selectDestination(item)
                }
              >
                📍 {item}
              </button>
            ))}
          </div>
        )}

      {search.trim().length >= 3 &&
        filtered.length === 0 && (
          <div className="mt-4 rounded-xl border p-3 text-sm text-gray-500">
            No places found.
          </div>
        )}
    </div>
  );
}