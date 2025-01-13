import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosInstance";
import TopNav from "../components/Topnav";
import Alert from "../components/Alert";

const Cert = ({ setFields = () => {} }) => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontStyle, setFontStyle] = useState("Arial");
  const [fontStyles, setFontStyles] = useState([]);
  const [fontAlignments, setFontAlignments] = useState({});
  const [fieldName, setFieldName] = useState("");
  const [showSelection, setShowSelection] = useState(false);
  const [selection, setSelection] = useState({
    width: 100,
    height: 50,
    x: 0,
    y: 0,
  });
  const [lastCoordinates, setLastCoordinates] = useState(null);
  const [savedFields, setSavedFields] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [alert, setAlert] = useState(null);
  const [zipName, setZipName] = useState("");
  const [showZipNameModal, setShowZipNameModal] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchFontStyles();
  }, []);

  const fetchFontStyles = async () => {
    try {
      const response = await instance.get("/my_app/fonts/");
      setFontStyles(response.data.font_list.font_name || []);
      if (response.data.font_list?.length > 0) {
        setFontStyle(response.data.font_list[0]);
      }
    } catch (error) {
      console.error("Failed to fetch font styles:", error);
    }
  };

  const clearAllData = () => {
    setPreviewImage(null);
    setTemplateFile(null);
    setDataFile(null);
    setFontColor("#000000");
    setFontStyle(fontStyles[0]);
    setFontAlignments({});
    setFieldName("");
    setShowSelection(false);
    setSelection({
      width: 100,
      height: 50,
      x: 0,
      y: 0,
    });
    setLastCoordinates(null);
    setSavedFields([]);
    setIsGenerating(false);
    setCertificateUrl(null);
    setIsDownloadReady(false);
    setZipName("");
  };

  const getImageCoordinates = (selectionBox) => {
    const certificateImg = document.querySelector(".certificate-image");
    if (!certificateImg) return null;

    const imageWidth = certificateImg.naturalWidth;
    const imageHeight = certificateImg.naturalHeight;
    const displayWidth = certificateImg.getBoundingClientRect().width;
    const displayHeight = certificateImg.getBoundingClientRect().height;

    const topLeft = [
      Math.round((selectionBox.x / displayWidth) * imageWidth),
      Math.round((selectionBox.y / displayHeight) * imageHeight),
    ];

    const bottomRight = [
      Math.round(
        ((selectionBox.x + selectionBox.width) / displayWidth) * imageWidth
      ),
      Math.round(
        ((selectionBox.y + selectionBox.height) / displayHeight) * imageHeight
      ),
    ];

    if (bottomRight[0] <= topLeft[0] || bottomRight[1] <= topLeft[1]) {
      setAlert({
        type: "error",
        message:
          "Please make a valid selection (width and height must be positive)",
      });
      return null;
    }

    setLastCoordinates({ topLeft, bottomRight });
    return { topLeft, bottomRight };
  };

  const saveField = () => {
    if (!fieldName) {
      setAlert({ type: "error", message: "Please enter a field name" });
      return;
    }

    const coordinates = getImageCoordinates(selection);
    if (!coordinates) return;

    const newField = {
      name: fieldName,
      top_left_corner: coordinates.topLeft,
      bottom_right_corner: coordinates.bottomRight,
    };

    setSavedFields([...savedFields, newField]);
    setFields([...savedFields, newField]);
    setFieldName("");
    setShowSelection(false);
  };

  const deleteField = (index) => {
    const updatedFields = savedFields.filter((field, i) => i !== index);
    setSavedFields(updatedFields);
    setFields(updatedFields);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDataUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setDataFile(file);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await instance.get("/my_app/login/");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        navigate("/");
      }
    }
  };

  const handleColorChange = (e) => setFontColor(e.target.value);

  const handleFontAlignmentChange = (field, alignment) => {
    setFontAlignments({ ...fontAlignments, [field]: alignment });
  };

  const generateCertificates = async () => {
    if (!templateFile || !dataFile || savedFields.length === 0) {
      setAlert({
        type: "error",
        message:
          "Please upload template, data file, and add at least one field!",
      });
      return;
    }

    setIsGenerating(true);

    const formData = new FormData();
    formData.append("template", templateFile);
    formData.append("data_file", dataFile);
    formData.append("color", fontColor);
    formData.append("font_style", fontStyle);
    formData.append(
      "data",
      JSON.stringify({
        data: savedFields.map((field) => ({
          field_name: field.name,
          top_left_corner: field.top_left_corner,
          bottom_right_corner: field.bottom_right_corner,
          alignment: fontAlignments[field.name] || "left",
        })),
      })
    );

    try {
      const response = await instance.post("/my_app/zipify/", formData);
      const { file_path, message } = response.data;

      if (message === "Zip file created successfully" && file_path) {
        setAlert({
          type: "success",
          message: "Certificates generated! You can download them now...",
        });
        setCertificateUrl(`/media${file_path}`);
        setIsDownloadReady(true);
        setShowZipNameModal(true);
      }
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message:
          error.response.data.error ||
          "Error generating certificates. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCertificates = async () => {
    if (!zipName.trim()) {
      setAlert({
        type: "error",
        message: "Please enter a name for the zip file",
      });
      return;
    }

    if (certificateUrl) {
      try {
        const downloadUrl = `${instance.defaults.baseURL}${certificateUrl}`;
        const response = await instance.get(downloadUrl, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${zipName.trim()}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setShowZipNameModal(false);
      } catch (error) {
        console.error(error);
        setAlert({
          type: "error",
          message: "Failed to download the certificates. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <TopNav />

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {showZipNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">Name your zip file</h3>
            <input
              type="text"
              value={zipName}
              onChange={(e) => setZipName(e.target.value)}
              placeholder="Enter zip file name"
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowZipNameModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={downloadCertificates}
                className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-400"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row mt-16 h-[calc(100vh-4rem)]">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden fixed top-16 right-4 z-40 bg-violet-500 text-white p-2 rounded-full"
        >
          {showSidebar ? "✕" : "☰"}
        </button>

        <div
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative w-full md:w-80 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col z-30 transition-transform duration-300`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={clearAllData}
                className="text-red-500 hover:text-red-700"
              >
                Clear All
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Template
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data File
              </label>
              <input
                type="file"
                accept=".json,.csv,.xlsx,.xls"
                onChange={handleDataUpload}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Style
              </label>
              <select
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {fontStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Colour
              </label>
              <input
                type="color"
                value={fontColor}
                onChange={handleColorChange}
                className="w-full border p-1"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">New Field</h3>
                <button
                  onClick={() => setShowSelection(!showSelection)}
                  className="text-sm text-violet-500 hover:text-violet-600"
                >
                  {showSelection ? "Cancel" : "Add Field"}
                </button>
              </div>
              <input
                type="text"
                placeholder="Field name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md mb-2"
              />
              {showSelection && lastCoordinates && (
                <div className="text-xs text-gray-600 mb-2">
                  <div>Top-Left: [{lastCoordinates.topLeft.join(", ")}]</div>
                  <div>
                    Bottom-Right: [{lastCoordinates.bottomRight.join(", ")}]
                  </div>
                </div>
              )}

              {showSelection && (
                <button
                  onClick={saveField}
                  className="w-full bg-violet-400 text-white py-1 px-4 rounded-md hover:bg-violet-300"
                >
                  Save Field
                </button>
              )}
            </div>

            {savedFields.length > 0 && (
              <div>
                <h3 className="text-sm mb-2 font-medium text-gray-700">
                  Added Fields ({savedFields.length})
                </h3>
                {savedFields.map((field, index) => (
                  <div key={index} className="p-2 mb-2 bg-gray-100 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">{field.name}</span>
                      <button
                        onClick={() => deleteField(index)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          handleFontAlignmentChange(field.name, "left")
                        }
                        className={`flex-1 py-1 px-2 text-xs rounded ${
                          fontAlignments[field.name] === "left" ||
                          !fontAlignments[field.name]
                            ? "bg-violet-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Left
                      </button>
                      <button
                        onClick={() =>
                          handleFontAlignmentChange(field.name, "center")
                        }
                        className={`flex-1 py-1 px-2 text-xs rounded ${
                          fontAlignments[field.name] === "center"
                            ? "bg-violet-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Center
                      </button>
                      <button
                        onClick={() =>
                          handleFontAlignmentChange(field.name, "right")
                        }
                        className={`flex-1 py-1 px-2 text-xs rounded ${
                          fontAlignments[field.name] === "right"
                            ? "bg-violet-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Right
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            {!isDownloadReady ? (
              <button
                onClick={generateCertificates}
                disabled={isGenerating || savedFields.length === 0}
                className="w-full bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-400 disabled:bg-violet-300"
              >
                {isGenerating ? "Generating..." : "Generate Certificates"}
              </button>
            ) : (
              <button
                onClick={downloadCertificates}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
              >
                Download Certificates
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 h-full flex justify-center items-center bg-gray-50 p-7 md:p-8 relative overflow-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500 mb-4"></div>
              <p className="text-gray-600">Generating your certificates...</p>
            </div>
          ) : previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Certificate template"
                className="certificate-image max-w-full h-[calc(100vh-6rem)] object-contain"
              />
              {showSelection && (
                <Rnd
                  className="bg-violet-500 bg-opacity-20 border-2 border-violet-500 flex items-center justify-center"
                  size={{ width: selection.width, height: selection.height }}
                  position={{ x: selection.x, y: selection.y }}
                  onDragStop={(e, d) => {
                    setSelection((prev) => ({
                      ...prev,
                      x: Math.max(0, d.x),
                      y: Math.max(0, d.y),
                    }));
                    getImageCoordinates({ ...selection, x: d.x, y: d.y });
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    const newSelection = {
                      width: parseFloat(ref.style.width) || 100,
                      height: parseFloat(ref.style.height) || 50,
                      x: Math.max(0, position.x),
                      y: Math.max(0, position.y),
                    };
                    setSelection(newSelection);
                    getImageCoordinates(newSelection);
                  }}
                  minWidth={20}
                  minHeight={20}
                  bounds="parent"
                >
                  {fieldName && (
                    <div
                      style={{
                        color: fontColor,
                        fontFamily: fontStyle,
                        textAlign: fontAlignments[fieldName] || "left",
                      }}
                    >
                      {fieldName}
                    </div>
                  )}
                </Rnd>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-lg text-center">
              Upload a template to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cert;
