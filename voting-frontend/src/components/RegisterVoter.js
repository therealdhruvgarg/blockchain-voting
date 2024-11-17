import React, { useState } from 'react';
import axios from 'axios';

function RegisterVoter() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    phoneNumber: '',
    aadharNumber: '',
    otp: '' // Add OTP field for verification
  });
  const [errors, setErrors] = useState({
    name: '',
    dob: '',
    phoneNumber: '',
    aadharNumber: '',
    otp: '' // Add OTP error field
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Flag to track OTP status
  const [otpVerified, setOtpVerified] = useState(false); // Flag to track OTP verification status

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Ensure only the last 10 digits are entered by the user, and prepend +91
      const formattedPhone = value.startsWith('+') ? '+' + value.slice(1).replace(/\D/g, '') : value.replace(/\D/g, '');
 // Keep only numbers and limit to 10 digits
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
    let formErrors = { name: '', dob: '', phoneNumber: '', aadharNumber: '' };
    let isValid = true;
  
    // Name validation
    if (!formData.name) {
      formErrors.name = 'Name is required';
      isValid = false;
    }
  
    // Date of birth validation (must be 18 or above)
    const dob = new Date(formData.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (!formData.dob || age < 18) {
      formErrors.dob = 'You must be at least 18 years old';
      isValid = false;
    }
  
    // Phone number validation (removed 10 digit requirement)
    if (!formData.phoneNumber) {
      formErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }
  
    // Aadhar number validation (12 digits)
    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      formErrors.aadharNumber = 'Aadhar number must be 12 digits';
      isValid = false;
    }
  
    setErrors(formErrors);
    return isValid;
  };
  
  
  

  const sendOtp = async () => {
    if (!formData.phoneNumber) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { phone: formData.phoneNumber });
      setOtpSent(true); // Set OTP sent flag
      alert('OTP sent successfully!');
    } catch (error) {
      alert('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert('Please enter the OTP');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', {
        phone: formData.phoneNumber,
        otp: formData.otp
      });
      setOtpVerified(true); // Set OTP verified flag
      alert('OTP verified successfully!');
    } catch (error) {
      alert('Invalid OTP');
    }
  };

  const registerVoter = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        // Prefix +91 to the phone number before sending to the backend
        const phoneWithCountryCode = `+91${formData.phoneNumber}`;
        
        // Send the form data to the backend API with the correct phone number format
        const response = await axios.post('http://localhost:5000/register', {
          ...formData,
          phoneNumber: phoneWithCountryCode,
        });
  
        setSuccessMessage(response.data.message);
  
        // Clear the form after successful registration
        setFormData({
          name: '',
          dob: '',
          phoneNumber: '',
          aadharNumber: ''
        });
        setErrors({});
      } catch (error) {
        setErrors({ general: 'Error registering voter. Please try again later.' });
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
          <div className="text-green-500 text-center mt-4">{successMessage}</div>
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

            {/* Date of Birth Field */}
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

            {/* Phone Number Field */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
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
              {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
            </div>

            {/* Aadhar Number Field */}
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

            {/* OTP Field (Only shown after phone number is entered) */}
            {otpSent && (
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0a0a5e] hover:bg-[#0a0a7e] text-white py-2 rounded mt-4"
              disabled={!otpVerified}
            >
              Register
            </button>
          </form>

          {/* OTP Send Button */}
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
