import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Register() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customers");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    const jsonData = {
      data: {
        name: name,
        email: email,
        password: password,

      }
    }
    const jsonString = JSON.stringify(jsonData);
    try {
      const response = await fetch(`http://localhost:1337/api/${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });
      if (response.ok) {
        const data = await response.json();
        alert("Registration successful!");
        navigate("/");
      } else {
        const errorData = await response.text();
        alert("Registration failed!");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering!");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <a href="/" className="text-3xl font-bold text-[#4B3D8F]">
            REGALO
            <span className="block text-xs text-center">GIFT SHOP</span>
          </a>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="mb-2">
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>


          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm">
              Show Password
            </label>
          </div>
          <div className="mb-4 flex gap-2">
            <select
              id="role"
              className="w-1/2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customers">Customer</option>
              <option value="admins">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full font-bold py-2 bg-[#4B3D8F] text-white rounded-lg hover:bg-[#4B3D8F] focus:outline-none"
            >
              Register
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-[#4B3D8F] underline font-bold">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


export default Register;



