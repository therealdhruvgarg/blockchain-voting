import React, { useState } from "react";
import axios from "axios";

function RegisterVoter() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phoneNumber: "",
    aadharNumber: "",
    otp: "", // Add OTP field for verification
  });
  const [errors, setErrors] = useState({
    name: "",
    dob: "",
    phoneNumber: "",
    aadharNumber: "",
    otp: "", // Add OTP error field
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [voterId, setVoterId] = useState(""); // Store Voter ID
  const [otpSent, setOtpSent] = useState(false); // Flag to track OTP status
  const [otpVerified, setOtpVerified] = useState(false); // Flag to track OTP verification status

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "phoneNumber") {
      // Ensure input always starts with +91
      let formattedPhone = value.startsWith('+91') 
        ? value 
        : `+91${value.replace(/\D/g, '')}`; // Add +91 if missing
  
      // Remove non-numeric characters and limit to 10 digits after +91
      const digitsOnly = formattedPhone.replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10);
  
      formattedPhone = `+91${digitsOnly}`; // Final formatted phone number
  
      setFormData({
        ...formData,
        phoneNumber: formattedPhone,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  

  const validateForm = () => {
    let formErrors = { name: "", dob: "", phoneNumber: "", aadharNumber: "" };
    let isValid = true;

    // Name validation
    if (!formData.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }

    // Date of birth validation (must be 18 or above)
    const dob = new Date(formData.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (!formData.dob || age < 18) {
      formErrors.dob = "You must be at least 18 years old";
      isValid = false;
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      formErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }

    // Aadhar number validation (12 digits)
    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      formErrors.aadharNumber = "Aadhar number must be 12 digits";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const sendOtp = async () => {
    if (!formData.phoneNumber) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/send-otp", {
        phone: formData.phoneNumber,
      });
      setOtpSent(true); // Set OTP sent flag
      alert("OTP sent successfully!");
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
        phone: formData.phoneNumber,
        otp: formData.otp,
      });
      setOtpVerified(true); // Set OTP verified flag
      alert("OTP verified successfully!");
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  const registerVoter = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/register",
          formData
        );

        // Set success message and voter ID
        setSuccessMessage(response.data.message);
        setVoterId(response.data.voterId); // Extract voter ID from the response

        // Clear the form after successful registration
        setFormData({
          name: "",
          dob: "",
          phoneNumber: "",
          aadharNumber: "",
          otp: "",
        });
        setErrors({});
      } catch (error) {
        setErrors({
          general: "Error registering voter. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register to Vote
        </h2>
        {successMessage && (
          <div className="text-green-500 text-center mt-4">
            {successMessage}
            {voterId && (
              <p className="mt-2">
                Your Voter ID: <span className="font-bold">{voterId}</span>
              </p>
            )}
          </div>
        )}
        {errors.general && (
          <div className="text-red-500 text-center mt-4">{errors.general}</div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={registerVoter}>
            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md shadow-sm"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="mb-4">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md shadow-sm"
              />
              {errors.dob && (
                <p className="text-red-500 text-xs">{errors.dob}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md shadow-sm"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Aadhar Number Field */}
            <div className="mb-4">
              <label
                htmlFor="aadharNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Aadhar Number
              </label>
              <input
                id="aadharNumber"
                name="aadharNumber"
                type="text"
                value={formData.aadharNumber}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md shadow-sm"
              />
              {errors.aadharNumber && (
                <p className="text-red-500 text-xs">{errors.aadharNumber}</p>
              )}
            </div>

            {/* OTP Field */}
            {otpSent && !otpVerified && (
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm"
                />
                {errors.otp && (
                  <p className="text-red-500 text-xs">{errors.otp}</p>
                )}
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded mt-4"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* Register Button */}
            {otpVerified && (
              <button
                type="submit"
                className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded mt-4"
              >
                Register
              </button>
            )}
          </form>

          {/* Send OTP Button */}
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded mt-4"
            >
              Send OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterVoter;
