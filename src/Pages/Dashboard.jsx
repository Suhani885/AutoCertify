import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchCertificates();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("https://10.21.99.10:8000/user/profile");
      setUserEmail(response.data.email);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get("https://10.21.99.10:8000/main/history");
      setCertificates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl) => {
    try {
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      const isZip = contentType === "application/zip";

      const blob = new Blob([response.data], {
        type: isZip ? "application/zip" : "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificates${isZip ? ".zip" : ".pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-8 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-violet-600">Welcome back!</h1>
        <p className="text-gray-600 mt-2">{userEmail}</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Certificate History
        </h2>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-6l-2-2H5c-1.1 0-2 .9-2 2z" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">
              No certificates generated yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <svg
                    className="w-8 h-8 text-violet-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-6l-2-2H5c-1.1 0-2 .9-2 2z" />
                  </svg>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDate(cert.generatedAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(cert.downloadUrl)}
                  className="mt-4 w-full bg-violet-500 hover:bg-violet-400 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
