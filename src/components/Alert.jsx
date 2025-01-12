import React from "react";

const Alert = ({ type, message, onClose }) => {
  if (!message) return null;

  const alertStyles = {
    base: "fixed top-4 left-1/2 transform -translate-x-1/2 max-w-lg w-full p-4 rounded shadow-lg z-50 transition-opacity duration-300",
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
  };

  const icons = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  };

  return (
    <div className={`${alertStyles.base} ${alertStyles[type]}`}>
      <div className="flex items-center">
        <div className="mr-3">{icons[type]}</div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="text-sm text-gray-400 ml-4">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Alert;
