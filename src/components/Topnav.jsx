import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import instance from "../services/axiosInstance";

const TopNav = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleLogout = async () => {
    const userConfirmed = window.confirm("Do you really want to logout?");
    if (userConfirmed) {
      try {
        const response = await instance.post("/my_app/logout/");
        if (response.status === 200) {
          setAlert({ type: "success", message: "Logged out successfully!" });
          setTimeout(() => navigate("/"), 2000);
        } else {
          setAlert({ type: "error", message: response.data.error });
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: "Logout failed. Please try again.",
        });
        console.error("Logout failed:", error);
      }
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleCertificates = () => {
    navigate("/main");
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
              className="w-6 h-6 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
          <button
            onClick={handleCertificates}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Certificates"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.3em"
              height="1.2em"
              viewBox="0 0 26 24"
            >
              <path
                fill="#000"
                d="m.061 8.78l4.801 14.399c.164.481.611.82 1.138.821h19.199q.072 0 .141-.009l-.006.001l.036-.006a1 1 0 0 0 .094-.018l.038-.009q.046-.012.094-.028l.036-.013q.045-.017.094-.041l.029-.014a1 1 0 0 0 .114-.068l-.004.003a1 1 0 0 0 .106-.081l-.002.001l.028-.025l.067-.064l.031-.034a1 1 0 0 0 .058-.072l.017-.021l.008-.012q.034-.048.063-.1l.007-.011a1 1 0 0 0 .055-.115l.003-.008l.007-.019q.021-.052.036-.106c0-.012.007-.024.009-.037q.011-.044.02-.094c0-.015.005-.03.007-.045l.008-.085c.002-.028 0-.034 0-.051V1.2A1.2 1.2 0 0 0 25.2 0h-9.6a1.2 1.2 0 0 0-1.2 1.2v1.2H6a1.2 1.2 0 0 0-1.2 1.2v3.6H1.2A1.2 1.2 0 0 0 .065 8.786l-.003-.008zM23.999 2.4v13.003l-2.462-7.385a1.2 1.2 0 0 0-1.138-.821H7.2V4.8h8.4a1.2 1.2 0 0 0 1.2-1.2V2.401zM2.865 9.6h16.67l4 12H6.865z"
              />
            </svg>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Logout"
          >
            <svg
              className="w-6 h-6 text-black"
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

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </nav>
  );
};

export default TopNav;
