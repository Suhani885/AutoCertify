import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TopNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("https://10.21.99.10:8000/auth/logout/");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center space-x-4">
          <img
            src="src/assets/certLogo.png"
            alt="Logo"
            className="h-14 w-auto"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleDashboard}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Dashboard"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Logout"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
