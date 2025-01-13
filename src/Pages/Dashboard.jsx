import React, { useState, useEffect } from "react";
import instance from "../services/axiosInstance";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import History from "../components/History";
import Templates from "../components/Templates";
import Home from "../components/Home";
import Trash from "../components/Trash";
import Alert from "../components/Alert";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const baseURL = instance.defaults.baseURL;

  useEffect(() => {
    fetchUserData();
    fetchCertificates();
    fetchTemplates();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await instance.get("/my_app/login/");
      setUserEmail(response.data.user_info.first_name);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        navigate("/");
      }
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await instance.get("/my_app/zipify");
      setCertificates(response.data.file_data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await instance.get("/my_app/templates");
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  const handleZipDownload = async (cert) => {
    try {
      const response = await instance.get(`/media/${cert.zip_file_path}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", cert.zip_file_name || "certificates.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setAlert({
        type: "success",
        message: "File Downloaded successfully",
      });
    } catch (error) {
      console.error("Failed to download zip file:", error);
      setAlert({
        type: "error",
        message:
          error.response.data.error ||
          "Failed to download certificates. Please try again.",
      });
    }
  };

  const handleTemplateDownload = async (template) => {
    try {
      const response = await instance.get(`/media/${template.template_path}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        template.template_path.split("/").pop() || "template.docx"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setAlert({
        type: "success",
        message: "Template downloaded successfully",
      });
    } catch (error) {
      console.error("Failed to download template:", error);
      setAlert({
        type: "error",
        message:
          error.response.data.error ||
          "Failed to download template. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 right-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div className="flex mt-16">
        <DashSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex-1 p-6 md:ml-4">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>

          {activeSection === "home" && (
            <Home userEmail={userEmail} certificates={certificates} />
          )}
          {activeSection === "history" && (
            <History
              certificates={certificates}
              onDownload={handleZipDownload}
              fetchCertificates={fetchCertificates}
            />
          )}
          {activeSection === "templates" && (
            <Templates
              templates={templates}
              onDownload={handleTemplateDownload}
              baseURL={baseURL}
            />
          )}
          {activeSection === "trash" && <Trash />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
