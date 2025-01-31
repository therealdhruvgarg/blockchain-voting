// process.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

// SVG components for the steps
const StepIcon = ({ stepNumber, icon, stepTitle, description, onClick }) => (
  <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-500 text-white">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-semibold">{stepTitle}</h3>
    <p className="text-center text-gray-600 text-sm">{description}</p>
  </div>
);

const Process = () => {
  const [step, setStep] = useState(1); // Track the current step in the process
  const navigate = useNavigate(); // hook for navigation

  // Dynamic instructions for each step
  const instructions = {
    1: {
      title: "Instructions for Registering to Vote",
      content: (
        <ul className="list-decimal pl-5 text-gray-700 space-y-2">
          <li><strong>Enter Your Details:</strong> Fill in your name, date of birth, phone number, and Aadhar number.</li>
          <li><strong>Send OTP:</strong> After entering your phone number, click the "Send OTP" button to receive an OTP (One-Time Password) on your phone.</li>
          <li><strong>Verify OTP:</strong> Enter the OTP received on your phone to verify your identity.</li>
          <li><strong>Complete Registration:</strong> After OTP verification, click "Register" to complete your registration and get your unique Voter ID.</li>
          <li><strong>Next Step:</strong> After registering, you will be redirected to the login page. Use your credentials to log in and cast your vote.</li>
        </ul>
      ),
    },
    2: {
      title: "Instructions for Voter Login",
      content: (
        <ul className="list-decimal pl-5 text-gray-700 space-y-2">
            <li><strong>Enter Your Voter ID:</strong> Your unique Voter ID issued after registration.</li>
            <li><strong>Enter Your Date of Birth:</strong> Ensure the format is correct and matches your registration details.</li>
            <li><strong>Click Login:</strong> After filling the details, click the "Login" button to access your voting rights.</li>
        </ul>
      ),
    },
    3: {
      title: "Instructions for Vote Casting",
      content: (
        <div>
          <p className="text-gray-700">To cast your vote, follow these steps:</p>
          <ul className="list-decimal pl-5 text-gray-700 space-y-2">
            <li><strong>Select a Candidate:</strong> From the list of candidates, choose the one you wish to vote for.</li>
            <li><strong>Click Cast Vote:</strong> Once you've selected a candidate, click the "Cast Vote" button to submit your vote.</li>
            <li><strong>Vote Confirmation:</strong> After casting your vote, you'll receive a confirmation that your vote has been successfully recorded.</li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-10">
      {/* Process Flow Header */}
      <h1 className="text-3xl font-semibold text-blue-600">Vote Casting Process</h1>

      {/* Visual representation of the steps */}
      <div className="flex space-x-12 justify-center items-center">
        {/* Step 1 */}
        <StepIcon 
          stepNumber={1} 
          icon={<img src="https://img.icons8.com/ios-filled/50/ffffff/person-male.png" alt="Voter Registration" />} 
          stepTitle="Step 1: Voter Registration"
          description="Fill in your details to create a voter account."
          onClick={() => setStep(1)} // Navigate to Step 1
        />

        {/* Arrow (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>

        {/* Step 2 */}
        <StepIcon 
          stepNumber={2} 
          icon={<img src="https://img.icons8.com/ios-filled/50/ffffff/login-rounded-right.png" alt="Voter Login" />} 
          stepTitle="Step 2: Voter Login"
          description="Login with your credentials to access your voting rights."
          onClick={() => setStep(2)} // Navigate to Step 2
        />

        {/* Arrow (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>

        {/* Step 3 */}
        <StepIcon 
          stepNumber={3} 
          icon={<img src="https://img.icons8.com/ios-filled/50/ffffff/checked-radio-button.png" alt="Vote Casting" />} 
          stepTitle="Step 3: Vote Casting"
          description="Cast your vote for your preferred candidate."
          onClick={() => setStep(3)} // Navigate to Step 3
        />
      </div>

      {/* User Instructions */}
      <div className="mt-10 px-8 py-6 bg-gray-100 rounded-lg shadow-lg max-w-3xl text-left space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">{instructions[step].title}</h2>
        {instructions[step].content}
      </div>
    </div>
  );
};

export default Process;
