import React from 'react';
import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <header className="bg-[#0a0a5e] text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Wrap the logo and title in a Link to make it clickable */}
          <Link to="/" className="flex items-center">
            <svg
              className="h-8 w-8 text-[#FF9933]"
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
            <span className="font-bold text-xl">भारत ई-मतदान</span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link className="hover:text-[#FF9933]" to="/login">
            Login
          </Link>
          <Link className="hover:text-[#FF9933]" to="/process">
            Process
          </Link>
          <Link className="hover:text-[#FF9933]" to="/help">
            Help
          </Link>
          <Link className="hover:text-[#FF9933]" to="/contact">
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default navbar;
