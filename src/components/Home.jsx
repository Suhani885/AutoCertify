import React from "react";

const Home = ({ userEmail, onCreateNew }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-600 mt-2">{userEmail}</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
