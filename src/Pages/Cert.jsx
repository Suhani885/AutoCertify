import React, { useState } from "react";
import axios from "axios";

const Cert = ({ setFields = () => {} }) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [currentField, setCurrentField] = useState({
    name: "",
    points: { topLeft: null, bottomRight: null },
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [savedFields, setSavedFields] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const onDataFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDataFile(event.target.files[0]);
    }
  };

  const imageCoords = (event) => {
    const bounds = event.target.getBoundingClientRect();
    const x = event.pageX - bounds.left;
    const y = event.pageY - bounds.top;

    const cw = event.target.clientWidth;
    const ch = event.target.clientHeight;
    const iw = event.target.naturalWidth;
    const ih = event.target.naturalHeight;
    const px = Math.round((x / cw) * iw);
    const py = Math.round((y / ch) * ih);

    if (!currentField.points.topLeft) {
      setCurrentField({
        ...currentField,
        points: { ...currentField.points, topLeft: [px, py] },
      });
    } else {
      setCurrentField({
        ...currentField,
        points: { ...currentField.points, bottomRight: [px, py] },
      });
    }
  };

  const resetCurrentField = () => {
    setCurrentField({
      name: "",
      points: { topLeft: null, bottomRight: null },
    });
    setSelectedFieldIndex(null);
  };

  const addField = () => {
    if (
      !currentField.name ||
      !currentField.points.topLeft ||
      !currentField.points.bottomRight
    )
      return;

    const newField = {
      name: currentField.name,
      top_left_corner: currentField.points.topLeft,
      bottom_right_corner: currentField.points.bottomRight,
    };

    const updatedFields = [...savedFields, newField];
    setSavedFields(updatedFields);
    setFields(updatedFields);
    resetCurrentField();
  };

  const removeField = (index) => {
    const updatedFields = savedFields.filter((_, i) => i !== index);
    setSavedFields(updatedFields);
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    if (!imageFile || !dataFile || savedFields.length === 0) return;

    setIsLoading(true);
    setIsSubmit(true);
    setDownloadReady(false);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("userDataFile", dataFile);
    formData.append("field_coords", JSON.stringify(savedFields));

    try {
      const response = await axios.post("/main/generate/", formData);
      // setDownloadUrl(response.data.downloadUrl);
      setDownloadReady(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate certificates. Please try again.");
    } finally {
      setIsSubmit(false);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.click();
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white relative">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-violet-500 text-white p-2 rounded-full shadow-lg"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-300 ease-in-out md:transform-none fixed md:relative w-full md:w-80 h-screen bg-white border-r border-gray-200 flex flex-col z-40`}
      >
        <div className="p-4 border-b border-gray-200">
          <img
            src="src/assets/certLogo.png"
            alt="Logo"
            className="max-h-20 object-contain mb-1"
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Template
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-1 py-1 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="mt-2 text-sm text-gray-500">
                {image ? "Change template" : "Upload template"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImageChange}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
            Data File (JSON/CSV)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-1 py-1 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                className="hidden"
                accept=".json,.csv"
                onChange={onDataFileChange}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="mt-2 text-sm text-gray-500">
                {dataFile ? "Change file" : "Upload file"}
              </span>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">New Field</h3>
              {currentField.points.topLeft && (
                <button
                  onClick={resetCurrentField}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Reset
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Field name according to data file."
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md mb-2"
              value={currentField.name}
              onChange={(e) =>
                setCurrentField({ ...currentField, name: e.target.value })
              }
            />
            {currentField.points.topLeft && (
              <p className="text-sm">
                Top-Left: [{currentField.points.topLeft.join(", ")}]
              </p>
            )}
            {currentField.points.bottomRight && (
              <p className="text-sm">
                Bottom-Right: [{currentField.points.bottomRight.join(", ")}]
              </p>
            )}
            {currentField.points.topLeft && currentField.points.bottomRight && (
              <button
                onClick={addField}
                className="w-full mt-2 bg-violet-400 text-white py-1 px-4 rounded-md hover:bg-violet-300"
              >
                Save Field
              </button>
            )}
          </div>

          {savedFields.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm mb-2 font-medium text-gray-700">
                Added Fields ({savedFields.length})
              </h3>
              {savedFields.map((field, index) => (
                <div key={index} className="p-2 mb-2 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{field.name}</span>
                    <button
                      onClick={() => removeField(index)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm">
                    Top-Left: [{field.top_left_corner.join(", ")}]
                  </p>
                  <p className="text-sm">
                    Bottom-Right: [{field.bottom_right_corner.join(", ")}]
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          {!downloadReady ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmit || savedFields.length === 0}
              className="w-full bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-400 disabled:bg-violet-300"
            >
              {isSubmit ? "Generating..." : "Generate Certificates"}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Certificates
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 h-screen flex justify-center items-center bg-gray-50 p-4 md:p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500 mb-4"></div>
            <p className="text-gray-600">Generating your certificates...</p>
          </div>
        ) : image ? (
          <img
            alt="preview"
            src={image}
            className="max-w-full max-h-full object-contain shadow-lg cursor-crosshair"
            onClick={imageCoords}
          />
        ) : (
          <div className="text-gray-400 text-lg text-center">
            Upload a template to begin
          </div>
        )}
      </div>
    </div>
  );
};

export default Cert;
