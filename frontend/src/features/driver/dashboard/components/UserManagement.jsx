import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(null);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("auth_token");

  // ============================================================
  // LOAD USERS
  // ============================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/users`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load users."
        );
      }

      setUsers(
        Array.isArray(result?.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "ADMIN USERS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ============================================================
  // USER ACTIVE STATUS
  // ============================================================

  const handleUserStatus = async (
    user,
    isActive
  ) => {
    const actionKey =
      `user-${user.id}`;

    try {
      setActionLoading(actionKey);

      const response =
        await fetch(
          `${API_URL}/admin/users/${user.id}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              isActive,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to update account."
        );
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isActive,
                driverProfile:
                  item.driverProfile
                    ? {
                        ...item.driverProfile,

                        availability:
                          !isActive &&
                          item.driverProfile
                            .availability
                            ? {
                                ...item
                                  .driverProfile
                                  .availability,

                                isOnline: false,
                              }
                            : item
                                .driverProfile
                                .availability,
                      }
                    : item.driverProfile,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "UPDATE USER STATUS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update account."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // DRIVER ONLINE / OFFLINE
  // ============================================================

  const handleDriverOnline =
    async (
      user,
      isOnline
    ) => {
      const actionKey =
        `driver-${user.id}`;

      try {
        setActionLoading(actionKey);

        const response =
          await fetch(
            `${API_URL}/admin/users/${user.id}/driver-online`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                isOnline,
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to update driver status."
          );
        }

        setUsers((current) =>
          current.map((item) =>
            item.id === user.id
              ? {
                  ...item,

                  driverProfile:
                    item.driverProfile
                      ? {
                          ...item.driverProfile,

                          availability:
                            item.driverProfile
                              .availability
                              ? {
                                  ...item
                                    .driverProfile
                                    .availability,

                                  isOnline,
                                }
                              : item
                                  .driverProfile
                                  .availability,
                        }
                      : item.driverProfile,
                }
              : item
          )
        );
      } catch (error) {
        console.error(
          "UPDATE DRIVER ONLINE ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to update driver status."
        );
      } finally {
        setActionLoading(null);
      }
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="w-full">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-neutral-900">
          User Management
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Manage passenger and driver account status.
        </p>
      </div>

      {error && (
        <div
          className="
            mb-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-neutral-200
          bg-white
          shadow-sm
        "
      >
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500">
                    Account
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500">
                    Driver Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-500">
                    Online
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const driver =
                    user.driverProfile;

                  const isDriver =
                    Boolean(driver);

                  const isOnline =
                    Boolean(
                      driver
                        ?.availability
                        ?.isOnline
                    );

                  const userActionLoading =
                    actionLoading ===
                    `user-${user.id}`;

                  const driverActionLoading =
                    actionLoading ===
                    `driver-${user.id}`;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      {/* USER */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            {user.email ||
                              user.phone ||
                              `User #${user.id}`}
                          </p>

                          {user.phone &&
                            user.email && (
                              <p className="mt-1 text-xs text-neutral-500">
                                {user.phone}
                              </p>
                            )}
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="px-5 py-4">
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-neutral-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-neutral-700
                          "
                        >
                          {isDriver
                            ? "Driver"
                            : "Passenger"}
                        </span>
                      </td>

                      {/* ACCOUNT */}
                      <td className="px-5 py-4">
                        <span
                          className={
                            user.isActive
                              ? "text-sm font-medium text-green-600"
                              : "text-sm font-medium text-red-600"
                          }
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* DRIVER STATUS */}
                      <td className="px-5 py-4">
                        {isDriver ? (
                          <span className="text-sm text-neutral-700">
                            {driver.driverStatus ||
                              "—"}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* ONLINE */}
                      <td className="px-5 py-4">
                        {isDriver ? (
                          <span
                            className={
                              isOnline
                                ? "text-sm font-semibold text-green-600"
                                : "text-sm font-medium text-neutral-500"
                            }
                          >
                            {isOnline
                              ? "Online"
                              : "Offline"}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {user.isActive ? (
                            <button
                              type="button"
                              disabled={
                                userActionLoading
                              }
                              onClick={() =>
                                handleUserStatus(
                                  user,
                                  false
                                )
                              }
                              className="
                                rounded-lg
                                border
                                border-red-200
                                bg-white
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-red-600
                                hover:bg-red-50
                                disabled:opacity-50
                              "
                            >
                              {userActionLoading
                                ? "Updating..."
                                : "Deactivate"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                userActionLoading
                              }
                              onClick={() =>
                                handleUserStatus(
                                  user,
                                  true
                                )
                              }
                              className="
                                rounded-lg
                                bg-green-600
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-white
                                hover:bg-green-700
                                disabled:opacity-50
                              "
                            >
                              {userActionLoading
                                ? "Updating..."
                                : "Activate"}
                            </button>
                          )}

                          {isDriver &&
                            user.isActive &&
                            (isOnline ? (
                              <button
                                type="button"
                                disabled={
                                  driverActionLoading
                                }
                                onClick={() =>
                                  handleDriverOnline(
                                    user,
                                    false
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-neutral-300
                                  bg-white
                                  px-3
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-neutral-700
                                  hover:bg-neutral-50
                                  disabled:opacity-50
                                "
                              >
                                {driverActionLoading
                                  ? "Updating..."
                                  : "Set Offline"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={
                                  driverActionLoading
                                }
                                onClick={() =>
                                  handleDriverOnline(
                                    user,
                                    true
                                  )
                                }
                                className="
                                  rounded-lg
                                  bg-blue-600
                                  px-3
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-white
                                  hover:bg-blue-700
                                  disabled:opacity-50
                                "
                              >
                                {driverActionLoading
                                  ? "Updating..."
                                  : "Set Online"}
                              </button>
                            ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}