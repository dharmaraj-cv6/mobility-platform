import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../features/auth/hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600"
        >
          OwnTrip
        </Link>

        {/* Right Actions */}
        {!isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">

        

            {/* Dashboard */}
            {user?.role === "DRIVER" && (
              <Link
                to="/driver/dashboard"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Dashboard
              </Link>
            )}

             {user?.role === "PASSENGER" && (
              <Link
                to="/home"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Home
              </Link>
            )}
             {user?.role === "PASSENGER" && (
              <Link
                to="/home"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Home
              </Link>
            )}

             {user?.role === "PASSENGER" && (
              <Link
                to="/home"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Home
              </Link>
            )}

                {/* User */}
            <div className="hidden text-center sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.fullName}
              </p>
              
            </div>


             {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Logout
            </button>


           

           
          </div>
        )}
      </div>
    </header>
  );
}