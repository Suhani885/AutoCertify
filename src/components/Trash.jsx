import React, { useState, useEffect } from "react";
import instance from "../services/axiosInstance";

const Trash = () => {
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeletedFiles();
  }, []);

  const fetchDeletedFiles = async () => {
    try {
      const response = await instance.get("/my_app/trash/");
      setDeletedFiles(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch deleted files:", error);
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await instance.patch(
        "/my_app/trash/",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchDeletedFiles();
    } catch (error) {
      console.error("Failed to restore file:", error);
      alert("Failed to restore file. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(
        "/my_app/trash/",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      fetchDeletedFiles();
    } catch (error) {
      console.error("Failed to permanently delete file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Recently Deleted
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deletedFiles.map((file) => (
          <div key={file.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between ">
              <svg
                className="mx-auto "
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="#8b5cf6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path
                    fill="#8b5cf6"
                    fill-opacity="0"
                    stroke-dasharray="64"
                    stroke-dashoffset="64"
                    d="M12 7h8c0.55 0 1 0.45 1 1v10c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-11Z"
                  >
                    <animate
                      fill="freeze"
                      attributeName="fill-opacity"
                      begin="0.8s"
                      dur="0.15s"
                      values="0;0.3"
                    />
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      dur="0.6s"
                      values="64;0"
                    />
                  </path>
                  <path d="M12 7h-9v0c0 0 0.45 0 1 0h6z" opacity="0">
                    <animate
                      fill="freeze"
                      attributeName="d"
                      begin="0.6s"
                      dur="0.2s"
                      values="M12 7h-9v0c0 0 0.45 0 1 0h6z;M12 7h-9v-1c0 -0.55 0.45 -1 1 -1h6z"
                    />
                    <set
                      fill="freeze"
                      attributeName="opacity"
                      begin="0.6s"
                      to="1"
                    />
                  </path>
                </g>
              </svg>

              {/* <span className="text-xs text-gray-400">
                Deleted On {new Date(file.deleted_at).toLocaleDateString()}
              </span> */}
            </div>
            <div className="items-center justify-between truncate">
              <span className="text-sm font-medium  text-gray-600">
                {file.directory_name || file.template_name || file.zip_name}
              </span>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleRestore(file.id)}
                className="text-violet-500 hover:text-violet-600 text-sm m-2"
              >
                Restore
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {deletedFiles.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No recently deleted files
        </div>
      )}
    </div>
  );
};

export default Trash;
