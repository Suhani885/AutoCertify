import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopNav from "../components/TopNav";
import DashSidebar from "../components/DashSidebar";
import Home from "../components/Home";
import History from "../components/History";
import Templates from "../components/Templates";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchCertificates();
    fetchTemplates();
  }, []);

  const fetchUserData = async () => {
    try {
      // const response = await axios.get("https://10.21.99.10:8000/user/profile");
      setUserEmail(response.data.email);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        navigate("/");
      }
    }
  };

  const fetchCertificates = async () => {
    try {
      // const response = await axios.get("https://10.21.99.10:8000/main/history");
      setCertificates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // const response = await axios.get(
      //   "https://10.21.99.10:8000/main/templates"
      // );
      setTemplates(response.data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  const handleDownload = async (downloadUrl) => {
    try {
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificates.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download. Please try again.");
    }
  };

  const handleCreateNew = () => {
    navigate("/main");
  };

  const handleUseTemplate = (template) => {
    navigate("/main", { state: { template } });
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
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)] mt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="flex mt-16">
        <DashSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div className="flex-1 p-6 transition-all duration-300 ml-0 ">
          {activeSection === "home" && (
            <Home userEmail={userEmail} onCreateNew={handleCreateNew} />
          )}

          {activeSection === "history" && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Generated Certificates
              </h2>
              <History
                certificates={certificates}
                onDownload={handleDownload}
                formatDate={formatDate}
              />
            </>
          )}

          {activeSection === "templates" && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                My Templates
              </h2>
              <Templates
                templates={templates}
                onUseTemplate={handleUseTemplate}
                formatDate={formatDate}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
