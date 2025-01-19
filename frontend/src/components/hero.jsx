import React from 'react';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');  // Replace '/register' with the actual path to RegisterVoter.js in your routing setup
  };

  const handleLoginClick = ()=>{
    navigate('/login'); // Replace '/login' with the actual path to Login.js in your routing setup
  }

  return (
    <main className="flex-grow">
      <section className="bg-[#FF9933] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">India's Digital Voting Platform</h1>
          <p className="text-xl mb-8">Secure, Transparent, and Accessible Voting System</p>
          <button
            onClick={handleRegisterClick}
            className="px-6 py-3 bg-[#0a0a5e] text-white font-semibold rounded-lg shadow-md hover:bg-[#0a0a7e] transition duration-300 ease-in-out"
          >
            Register
          </button>

          <button
            onClick={handleLoginClick}
            className="ml-4 px-6 py-3 bg-[#0a0a5e] text-white font-semibold rounded-lg shadow-md hover:bg-[#0a0a7e] transition duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features of Our E-Voting System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg
                className="h-12 w-12 text-[#0a0a5e] mb-4"
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">Secure voting with advanced encryption and blockchain technology</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg
                className="h-12 w-12 text-[#0a0a5e] mb-4"
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
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Transparent</h3>
              <p className="text-gray-600">Audit trail to ensure transparency throughout the process</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg
                className="h-12 w-12 text-[#0a0a5e] mb-4"
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
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Accessible</h3>
              <p className="text-gray-600">Vote from anywhere, on any device, anytime</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#138808] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Find Your Polling Station</h2>
          <div className="max-w-md mx-auto flex">
            <input
              className="flex-grow p-3 text-gray-700 rounded-l-lg border-2 border-[#0a0a5e] focus:outline-none focus:border-[#0a0a7e] transition duration-300 ease-in-out"
              placeholder="Enter your PIN code"
              type="text"
            />
            <button className="px-6 py-3 bg-[#0a0a5e] text-white font-semibold rounded-r-lg hover:bg-[#0a0a7e] transition duration-300 ease-in-out">
              Search
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
