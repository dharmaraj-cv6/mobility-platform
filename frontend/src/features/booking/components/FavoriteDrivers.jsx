import {
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function FavoriteDrivers({
  availableDrivers = [],
  children,
}) {
  const [
    favoriteDriverIds,
    setFavoriteDriverIds,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD RIDER FAVORITE / PREVIOUSLY RIDDEN DRIVERS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadFavorites =
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            localStorage.getItem(
              "auth_token"
            ) ||
            localStorage.getItem(
              "token"
            );

          const response =
            await fetch(
              `${API_URL}/rider/favorite-drivers`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    token
                      ? `Bearer ${token}`
                      : "",

                  "Content-Type":
                    "application/json",
                },
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Unable to load favorite drivers."
            );
          }

          const data =
            Array.isArray(
              result?.data
            )
              ? result.data
              : [];

          const ids =
            data
              .map(
                (item) =>
                  item?.driverId ||
                  item?.driver?.id ||
                  item?.id
              )
              .filter(Boolean)
              .map(String);

          if (!cancelled) {
            setFavoriteDriverIds(
              ids
            );
          }
        } catch (error) {
          console.error(
            "FAVORITE DRIVER ERROR:",
            error
          );

          if (!cancelled) {
            setError(
              error instanceof Error
                ? error.message
                : "Unable to load favorite drivers."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // AVAILABLE FAVORITES
  //
  // availableDrivers already contains ONLY drivers
  // currently available/online.
  // =====================================================

  const availableFavorites =
    useMemo(() => {
      return availableDrivers.filter(
        (driver) =>
          favoriteDriverIds.includes(
            String(driver?.id)
          )
      );
    }, [
      availableDrivers,
      favoriteDriverIds,
    ]);

  // =====================================================
  // FAVORITES EXIST
  // =====================================================

  const hasFavorites =
    favoriteDriverIds.length > 0;

  // =====================================================
  // FAVORITE STATUS
  //
  // TRUE:
  // Rider has favorites
  // BUT none of those favorites are currently available.
  //
  // This is what displays N/A on Favorite button.
  // =====================================================

  const favoriteUnavailable =
    hasFavorites &&
    availableFavorites.length === 0;

  // =====================================================
  // FALLBACK
  //
  // IMPORTANT:
  //
  // Never return an empty driver list.
  //
  // If no favorite is currently available,
  // use the existing nearby available drivers.
  // =====================================================

  const driversToShow =
    availableFavorites.length > 0
      ? availableFavorites
      : availableDrivers;

  // =====================================================
  // CHILD RENDER
  // =====================================================

  return children({
    favoriteDriverIds,

    availableFavorites,

    driversToShow,

    hasFavorites,

    favoriteUnavailable,

    loading,

    error,
  });
}