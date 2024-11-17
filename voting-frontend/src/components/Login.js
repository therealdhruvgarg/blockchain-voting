import React, { useState } from "react";
import axios from "axios";
import "../index.css";
import CastVote from "./CastVote";

const Login = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [loginId, setLoginId] = useState(""); // Mobile number as login ID
  const [password, setPassword] = useState(""); // Aadhaar number as password
  const [successMessage, setSuccessMessage] = useState("");

  // Handle Aadhaar submission to retrieve mobile number and send OTP via backend
  const handleAadhaarSubmit = async () => {
    try {
      // Send Aadhaar number to the backend to get the mobile number
      const response = await axios.post("http://localhost:5000/get-mobile-by-aadhaar", { aadharNumber: aadhaar });
  
      if (response.data.success) {
        setMobile(response.data.mobile);
        
        // Send OTP request to backend server
        const otpResponse = await axios.post("http://localhost:5000/send-otp", { phone: response.data.mobile });
        if (otpResponse.data.success) {
          setOtpSent(true);
          alert(`OTP sent to mobile number: ${response.data.mobile}`);
        } else {
          setError("Failed to send OTP. Try again.");
        }
      } else {
        setError("Aadhaar number not found in the system.");
      }
    } catch (error) {
      console.error("Error submitting Aadhaar:", error);
      setError("Failed to retrieve mobile number. Try again.");
    }
  };
  

  // Handle OTP verification
  const handleOtpSubmit = async () => {
    try {
      // Verify OTP via backend server
      const response = await axios.post("http://localhost:5000/verify-otp", { phone: mobile, otp });

      if (response.data.success) {
        setOtpVerified(true);
        alert("OTP verified! You can now log in.");
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Try again.");
    }
  };

  // Handle the login process
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!loginId || !password) {
      setError('Both login ID (Mobile Number) and password (Aadhar Number) are required.');
      return;
    }

    try {
      // Make the API call to log in the voter
      const response = await axios.post('http://localhost:5000/login', {
        loginId, // Send mobile number as login ID
        password, // Send Aadhar number (hashed) as password
      });

      if (response.data.publicKey) {
        // Store the public key in localStorage
        localStorage.setItem('publicKey', response.data.publicKey);
        setSuccessMessage('Login successful! You can now cast your vote.');

        // Clear form fields
        setLoginId('');
        setPassword('');
        setError('');
      }
    } catch (err) {
      setError('Error logging in. Please check your credentials and try again.');
      console.error('Error during login:', err);
    }
  };

  // Render VotingComponent if OTP is successfully verified
  if (otpVerified) {
    return <CastVote />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg
            className="h-12 w-12 text-[#FF9933]"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 10c.34.73.5 1.33.5 2a3.5 3.5 0 0 1-6.65 1.5" />
            <path d="M9 12h.01" />
            <path d="M15 12h.01" />
            <path d="M10 16c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" />
            <path d="M8.5 2A6.5 6.5 0 0 1 15 8.5c0 1.72-.66 3.3-1.75 4.47" />
            <path d="M9 15.5c-2.5 0-3.5-1.5-3.5-3.5 0-.72.14-1.39.39-2" />
            <path d="M4.5 8.5C4.5 12.64 7.86 16 12 16" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to Vote</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <p className="text-red-500">{error}</p>}
          {!otpSent ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="aadhaar">
                  Enter your 12-digit Aadhaar number
                </label>
                <input
                  id="aadhaar"
                  type="text"
                  placeholder="Enter your 12-digit Aadhaar number"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAadhaarSubmit}
                className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded"
              >
                Submit Aadhaar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">OTP has been sent to: {mobile}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="otp">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleOtpSubmit}
                className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded"
              >
                Submit OTP
              </button>
            </div>
          )}
          {otpVerified && (
            <div className="space-y-6 mt-6">
              <h3 className="text-center text-xl font-semibold">Please Log In</h3>
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="loginId">Login ID (Mobile Number)</label>
                  <input
                    type="text"
                    id="loginId"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password (Aadhar Number)</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
                  />
                </div>

                <button type="submit" className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded">
                  Login
                </button>
              </form>
              {successMessage && (
                <p className="text-green-500 text-center mt-4">{successMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
