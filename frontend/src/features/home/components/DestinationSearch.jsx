import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const destinations = [
  "Coimbatore International Airport",
  "Coimbatore Railway Station",
  "Gandhipuram",
  "Ganapathy",
  "Ganapathy Bus Stand",
  "Brookefields Mall",
  "RS Puram",
  "Saibaba Colony",
  "Singanallur",
  "Ukkadam",
];

export default function HomeDestinationSearch() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const value = search.trim().toLowerCase();

    // Do not show/search before 3 characters
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const results = destinations
      .filter((item) =>
        item.toLowerCase().includes(value)
      )
      .slice(0, 3);

    setSuggestions(results);
  }, [search]);

  const selectDestination = (destination) => {
    navigate("/booking", {
      state: {
        destination,
      },
    });
  };

  return (
    <div className="pt-0 p-5">
      <input
        type="text"
        placeholder="Where do you want to go?"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full rounded-xl border border-primary-500 p-3"
      />

      {search.trim().length >= 3 &&
        suggestions.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                className="block w-full border-b border-gray-100 p-3 text-left last:border-b-0 hover:bg-gray-50"
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
        suggestions.length === 0 && (
          <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-500">
            No nearby places found.
          </div>
        )}
    </div>
  );
}