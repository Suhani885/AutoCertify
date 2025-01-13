import React, { useState, useEffect } from "react";
import instance from "../services/axiosInstance";

const History = ({ certificates, onDownload, fetchCertificates }) => {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedZipId, setSelectedZipId] = useState(null);
  const [newZipName, setNewZipName] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [currentFiles, setCurrentFiles] = useState(certificates || []);

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    setCurrentFiles(certificates);
  }, [certificates]);

  const fetchFolders = async () => {
    try {
      const response = await instance.get("/my_app/my-drive/");
      setFolders(response.data.child_directories || []);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete("/my_app/zipify/", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          file_id: id,
        },
      });
      fetchCertificates();
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await instance.delete("/my_app/my-drive/", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          id: id,
        },
      });
      fetchFolders();
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  const handleCreateFolder = async () => {
    const formData = new FormData();
    formData.append("name", newFolderName);

    try {
      await instance.post("/my_app/my-drive/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowFolderModal(false);
      setNewFolderName("");
      fetchFolders();
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleRenameFile = async () => {
    try {
      await instance.patch(
        "/my_app/zipify/rename/",
        {
          new_name: newZipName,
          file_id: selectedZipId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowRenameModal(false);
      setSelectedZipId(null);
      setNewZipName("");
      fetchCertificates();
    } catch (error) {
      console.error("Failed to rename zip:", error);
    }
  };

  const handleRenameFolder = async () => {
    try {
      await instance.patch(
        "/my_app/my-drive/rename/",
        {
          name: newFolderName,
          folder_id: selectedFolderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowRenameFolderModal(false);
      setSelectedFolderId(null);
      setNewFolderName("");
      fetchFolders();
    } catch (error) {
      console.error("Failed to rename:", error);
    }
  };

  const handleMoveToFolder = async () => {
    try {
      await instance.patch(
        "/my_app/zipify/move/",
        {
          file_id: selectedFile,
          destination_id: selectedFolderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowMoveModal(false);
      setSelectedFile([]);
      setSelectedFolderId(null);
      fetchCertificates();
    } catch (error) {
      console.error("Failed to move file:", error);
    }
  };

  const handleFolderClick = async (folderId) => {
    try {
      await instance.get(`/my_app/my-drive/?id=${folderId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCurrentFiles(response.data.zips || []);
      setCurrentFolderId(folderId);
    } catch (error) {
      console.error("Failed to fetch folder contents:", error);
    }
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  if (!currentFiles?.length && !folders?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <svg
          className="w-24 h-24 mx-auto text-violet-500 mb-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Files Yet
        </h3>
        <p className="text-gray-500">
          Start by creating a folder or uploading files
        </p>
        <button
          onClick={() => setShowFolderModal(true)}
          className="mt-6 px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
        >
          Create Folder
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFolderModal(true)}
            className="flex items-center px-5 py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors shadow-sm"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            New Folder
          </button>
          {selectedFile.length > 0 && (
            <>
              <button
                onClick={() => setShowMoveModal(true)}
                className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
              >
                Move to Folder
              </button>
              {/* <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {selectedFile.length} selected
              </span> */}
            </>
          )}
        </div>
        {currentFolderId && (
          <button
            onClick={() => {
              setCurrentFolderId(null);
              fetchCertificates();
            }}
            className="text-violet-500 hover:text-violet-600"
          >
            Back to Root
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!currentFolderId &&
          folders.map((folder) => (
            <div
              key={folder.child_directory_id}
              onClick={() => handleFolderClick(folder.child_directory_id)}
              className="cursor-pointer bg-white rounded-xl shadow-sm p-4 hover:shadow-md"
            >
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
              <div>
                <p className="text-center mt-4 font-medium text-gray-900">
                  {folder.child_directory_name}
                </p>
                <button
                  onClick={(e) => {
                    setSelectedFolderId(folder.child_directory_id);
                    setNewFolderName(folder.child_directory_name);
                    setShowRenameFolderModal(true);
                  }}
                  className="p-1 text-gray-400 hover:text-violet-500 rounded-full hover:bg-violet-50"
                  title="Rename"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    handleDeleteFolder(folder.child_directory_id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  title="Delete"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 7l-3 13H8L5 7" />
                    <path d="M23 7H1" />
                    <path d="M8 7V3h8v4" />
                  </svg>
                </button>
              </div>
              <div className="justify-center ">
                <span className="text-xs text-gray-400">
                  Created On {new Date(folder.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}

        {currentFiles.map((cert) => (
          <div
            key={cert.zip_id}
            className={`bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all group
              ${
                selectedFile.includes(cert.zip_id)
                  ? "ring-2 ring-violet-500"
                  : ""
              }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                onClick={() => {
                  if (selectedFile.includes(cert.zip_id)) {
                    setSelectedFile(
                      selectedFile.filter((id) => id !== cert.zip_id)
                    );
                  } else {
                    setSelectedFile([...selectedFile, cert.zip_id]);
                  }
                }}
                className="flex items-center cursor-pointer w-full"
              >
                <input
                  type="checkbox"
                  checked={selectedFile.includes(cert.zip_id)}
                  onChange={() => {}}
                  className="mr-3 h-4 w-4 text-violet-500 rounded focus:ring-violet-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="90"
                  height="90"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#8b5cf6"
                    d="M5 2.5a.5.5 0 0 0-.5.5v18a.5.5 0 0 0 .5.5h1.75a.75.75 0 0 1 0 1.5H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h9.982a2 2 0 0 1 1.414.586l4.018 4.018A2 2 0 0 1 21 7.018V21a2 2 0 0 1-2 2h-2.75a.75.75 0 0 1 0-1.5H19a.5.5 0 0 0 .5-.5V7.018a.5.5 0 0 0-.146-.354l-4.018-4.018a.5.5 0 0 0-.354-.146z"
                  />
                  <path
                    fill="#8b5cf6"
                    d="M11.5 15.75a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m.75-3.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5zm-.75-2.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75M12.25 6a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5zm-.75-2.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75M9.75 13.5a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5zM9 11.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m.75-3.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5zM9 5.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 9 5.25M11 17h1a2 2 0 0 1 2 2v4.25a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1-.75-.75V19a2 2 0 0 1 2-2m-.5 2v3.5h2V19a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5"
                  />
                </svg>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button
                  onClick={(e) => {
                    setSelectedZipId(cert.zip_id);
                    setNewZipName(cert.zip_file_name);
                    setShowRenameModal(true);
                  }}
                  className="p-1 text-gray-400 hover:text-violet-500 rounded-full hover:bg-violet-50"
                  title="Rename"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(cert.zip_id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  title="Delete"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 7l-3 13H8L5 7" />
                    <path d="M23 7H1" />
                    <path d="M8 7V3h8v4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-1 flex justify-around">
              <p className="text-sm text-gray-600 truncate font-medium text-center">
                {cert.zip_file_name}
              </p>
              <button
                onClick={() => onDownload(cert)}
                className="items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
            <div className="justify-center mt-5">
              <span className="text-xs text-gray-400">
                Created On {new Date(cert.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        title="Create New Folder"
      >
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter folder name"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoFocus
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowFolderModal(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateFolder}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
          >
            Create
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setSelectedZipId(null);
          setNewZipName("");
        }}
        title="Rename File"
      >
        <input
          type="text"
          value={newZipName}
          onChange={(e) => setNewZipName(e.target.value)}
          placeholder="Enter new name"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setShowRenameModal(false);
              setSelectedZipId(null);
              setNewZipName("");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRenameFile}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
          >
            Rename
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showRenameFolderModal}
        onClose={() => {
          setShowRenameFolderModal(false);
          setSelectedFolderId(null);
          setNewFolderName("");
        }}
        title="Rename File"
      >
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter new name"
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setShowRenameFolderModal(false);
              setSelectedFolderId(null);
              setNewFolderName("");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRenameFolder}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
          >
            Rename
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setSelectedFolderId(null);
        }}
        title="Move to Folder"
      >
        <div className="max-h-60 overflow-y-auto mb-4">
          {folders.map((folder) => (
            <div
              key={folder.child_directory_id}
              onClick={() => setSelectedFolderId(folder.child_directory_id)}
              className={`p-3 rounded-lg cursor-pointer mb-2 flex items-center
                ${
                  selectedFolderId === folder.child_directory_id
                    ? "bg-violet-50 text-violet-700"
                    : "hover:bg-gray-50"
                }`}
            >
              <svg
                className="w-5 h-5 mr-3 text-violet-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              {folder.child_directory_name}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setShowMoveModal(false);
              setSelectedFolderId(null);
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMoveToFolder}
            disabled={!selectedFolderId}
            className={`px-4 py-2 rounded-lg transition-colors
              ${
                selectedFolderId
                  ? "bg-violet-500 text-white hover:bg-violet-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            Move
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default History;
