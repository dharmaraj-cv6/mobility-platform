import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Lock } from "lucide-react";

const PassengerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Demo validation
    if (!formData.mobile || !formData.password) {
      alert("Please enter Mobile Number and Password");
      return;
    }

    console.log(formData);

    // Navigate to Home page
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center">
          Passenger Login
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Sign in to book your ride.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Mobile Number */}
          <div>
            <label className="block mb-2 font-medium">
              Mobile Number
            </label>

            <div className="flex items-center border rounded-lg px-3">
              <Phone size={18} className="text-gray-500" />

              <input
                type="tel"
                name="mobile"
                placeholder="Enter Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3">
              <Lock size={18} className="text-gray-500" />

              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm">

            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember Me
            </label>

            <button
              type="button"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>

        </form>

        {/* Register */}
        <div className="text-center mt-6">

          <p className="text-sm text-gray-600">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
};

export default PassengerLogin;