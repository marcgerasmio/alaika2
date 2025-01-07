import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customers");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:1337/api/${role}?filters[email][$eq]=${email}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      if (data.data.length === 0) {
        setError("Wrong Credentials");
        return;
      }

      const user = data.data[0];
      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(user));

      if (role === "admins") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred while logging in.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <a href="/" className="text-4xl font-bold text-[#4B3D8F]">
            REGALO
            <span className="block text-xs text-center text-gray-600">GIFT SHOP</span>
          </a>
        </div>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B3D8F] placeholder-gray-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B3D8F] placeholder-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <select
              id="role"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B3D8F]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customers">Customer</option>
              <option value="admins">Admin</option>
            </select>
          </div>

          {/* Show Password Toggle */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-600">
              Show Password
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          {/* Login Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full font-bold py-3 bg-[#4B3D8F] text-white rounded-lg hover:bg-[#3D2F7F] focus:outline-none transition duration-300"
            >
              Login
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/reg" className="text-[#4B3D8F] underline font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
