import React, { useState } from "react";
import { Rnd } from "react-rnd";
import axios from "axios";

const Cert = ({ setFields = () => {} }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
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
      alert(
        "Please make a valid selection (width and height must be positive)"
      );
      return null;
    }

    setLastCoordinates({ topLeft, bottomRight });
    return { topLeft, bottomRight };
  };

  const saveField = () => {
    if (!fieldName) {
      alert("Please enter a field name");
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

  const generateCertificates = async () => {
    if (!templateFile || !dataFile || savedFields.length === 0) {
      alert("Please upload template, data file and add at least one field");
      return;
    }

    setIsGenerating(true);
    setIsDownloadReady(false);

    const formData = new FormData();
    formData.append("image", templateFile);
    formData.append("userDataFile", dataFile);
    formData.append(
      "data",
      JSON.stringify({
        data: savedFields.map((field) => ({
          field_name: field.name,
          top_left_corner: field.top_left_corner,
          bottom_right_corner: field.bottom_right_corner,
        })),
      })
    );

    try {
      const response = await axios.post(
        "https://10.21.99.10:8000/main/generate/",
        formData
      );
      setCertificateUrl(response.data.downloadUrl);
      setIsDownloadReady(true);
    } catch (error) {
      alert("Failed to generate certificates. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCertificates = () => {
    if (certificateUrl) {
      const link = document.createElement("a");
      link.href = certificateUrl;
      link.click();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white relative">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 right-4 z-50 bg-violet-500 text-white p-2 rounded-full shadow-lg"
      >
        {showSidebar ? "✕" : "☰"}
      </button>

      <div
        className={`${showSidebar ? "translate-x-0" : "-translate-x-full"} 
                    fixed md:relative w-full md:w-80 h-screen bg-white border-r 
                    border-gray-200 flex flex-col z-40`}
      >
        <div className="p-4 border-b border-gray-200">
          <img
            src="src/assets/certLogo.png"
            alt="Logo"
            className="max-h-20 object-contain mb-1"
          />

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data File (JSON/CSV)
            </label>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleDataUpload}
              className="w-full p-2 border rounded"
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
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{field.name}</span>
                    <button
                      onClick={() => deleteField(index)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Top-Left: [{field.top_left_corner.join(", ")}]</div>
                    <div>
                      Bottom-Right: [{field.bottom_right_corner.join(", ")}]
                    </div>
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

      <div className="flex-1 h-screen flex justify-center items-center bg-gray-50 p-4 md:p-8 relative">
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
              className="certificate-image max-w-full max-h-full object-contain shadow-lg"
            />
            {showSelection && (
              <Rnd
                className="bg-violet-500 bg-opacity-20 border-2 border-violet-500"
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
              />
            )}
          </div>
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
