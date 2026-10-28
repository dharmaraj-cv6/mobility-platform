import { useState } from "react";
import { ShieldCheck, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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

    if (!formData.username || !formData.password) {
      alert("Please enter Username and Password");
      return;
    }

    // Demo Login
    console.log(formData);

    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}

        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <ShieldCheck className="text-white" size={40} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center">
          Super Admin Login
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to manage the platform
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Username */}

          <div>

            <label className="block mb-2 font-medium">
              Username
            </label>

            <div className="flex items-center border rounded-lg px-3">

              <User size={18} className="text-gray-500" />

              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
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

          {/* Remember */}

          <div className="flex justify-between text-sm">

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

          {/* Login */}

          <button onClick={()=> navigate("/superadmindashboard")}
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold"
          >
            Login
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Super Admin Access Only
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;