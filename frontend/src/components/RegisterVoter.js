import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterVoter() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone: "",
    aadharNumber: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [voterId, setVoterId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate(); // hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let formattedPhone = value.startsWith("+91")
        ? value
        : `+91${value.replace(/\D/g, "")}`;

      const digitsOnly = formattedPhone.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10);
      formattedPhone = `+91${digitsOnly}`;

      setFormData({
        ...formData,
        phone: formattedPhone,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      formErrors.name = "Name is required.";
      isValid = false;
    }

    const dob = new Date(formData.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (!formData.dob || age < 18) {
      formErrors.dob = "You must be at least 18 years old.";
      isValid = false;
    }

    const phoneRegex = /^\+91\d{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      formErrors.phone = "Phone number must be in the format +91XXXXXXXXXX.";
      isValid = false;
    }

    if (!formData.aadharNumber || !/^\d{12}$/.test(formData.aadharNumber)) {
      formErrors.aadharNumber = "Aadhar number must be exactly 12 digits.";
      isValid = false;
    }

    if (otpSent && !formData.otp) {
      formErrors.otp = "OTP is required for verification.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const sendOtp = async () => {
    if (!formData.phone) {
      alert("Please enter a valid phone number.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp`, {
        phone: formData.phone,
      });
      setOtpSent(true);
      alert(response.data.message || "OTP sent successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP. Please try again later.");
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp`, {
        phone: formData.phone,
        otp: formData.otp,
      });
      setOtpVerified(true);
      alert(response.data.message || "OTP verified successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const registerVoter = async (e) => {
    e.preventDefault();
  
    if (!otpVerified) {
      alert("Please verify the OTP first.");
      return;
    }
  
    if (validateForm()) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
          name: formData.name,
          dob: formData.dob,
          phoneNumber: formData.phone,
          aadharNumber: formData.aadharNumber,
        });
        setSuccessMessage(response.data.message);
        setVoterId(response.data.voterId);
        setFormData({
          name: "",
          dob: "",
          phone: "",
          aadharNumber: "",
          otp: "",
        });
        setErrors({});
        navigate("/login");
      } catch (error) {
        console.log("Registration Error:", error); 
        setErrors({
          general: error.response?.data?.message || "Error registering voter. Please try again later.",
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
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
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
              {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md shadow-sm"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700">
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

            {otpSent && !otpVerified && (
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
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
                {errors.otp && <p className="text-red-500 text-xs">{errors.otp}</p>}
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded mt-4"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {otpVerified && (
              <button
                type="submit"
                className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded mt-4"
              >
                Register
              </button>
            )}
          </form>

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
