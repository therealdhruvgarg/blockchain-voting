// Login Component
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Login = () => {
  const [voterId, setVoterId] = useState(""); // Voter ID for login
  const [dob, setDob] = useState(""); // Date of birth entered by the user
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  // Handle Voter ID and DOB submission
  const handleLoginSubmit = async () => {
    try {
      setLoading(true); // Set loading to true
      setError(""); // Clear any previous error messages

      // Send login details (voterId and dob) to the backend for verification
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { voterId, dob });

      if (response.data.success) {
        alert("Login successful! You can now proceed.");
        navigate("/cast-vote", { state: { voterId } }); // Pass the voterId via state
      } else {
        setError(response.data.message); // Show error message if login fails
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to login. Try again.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to Vote</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="voterId">
                Enter your Voter ID
              </label>
              <input
                id="voterId"
                type="text"
                placeholder="Enter your Voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="dob">
                Enter your Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleLoginSubmit}
              className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
