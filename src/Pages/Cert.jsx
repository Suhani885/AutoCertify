import React, { useState } from "react";
import axios from "axios";

const Cert = ({ fields = [], setFields = () => {}, onSave = () => {} }) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [points, setPoints] = useState({ topLeft: null, bottomRight: null });
  const [fieldName, setFieldName] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

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
    const px = (x / cw) * iw;
    const py = (y / ch) * ih;

    if (!points.topLeft) {
      setPoints({
        ...points,
        topLeft: { x: Math.round(px), y: Math.round(py) },
      });
    } else {
      setPoints({
        ...points,
        bottomRight: { x: Math.round(px), y: Math.round(py) },
      });
    }
  };

  const addField = () => {
    if (!fieldName || !points.topLeft || !points.bottomRight) return;

    const newField = {
      name: fieldName,
      topLeft: points.topLeft,
      bottomRight: points.bottomRight,
    };

    setFields([...fields, newField]);
    setFieldName("");
    setPoints({ topLeft: null, bottomRight: null });
  };

  const handleSubmit = async () => {
    if (!imageFile || !dataFile || fields.length === 0) return;

    setIsSubmit(true);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("userDataFile", dataFile);
    formData.append("fields", JSON.stringify(fields));

    try {
      await axios.post("/api/certificate", formData);
      setImage(null);
      setImageFile(null);
      setDataFile(null);
      setFields([]);
      setPoints({ topLeft: null, bottomRight: null });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-row bg-white">
      <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
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
          {points.topLeft && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700">
                Coordinates Selected:
              </h3>
              <p>
                Top-Left: ({points.topLeft.x}, {points.topLeft.y})
              </p>
              {points.bottomRight && (
                <p>
                  Bottom-Right: ({points.bottomRight.x}, {points.bottomRight.y})
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Field name according to data file."
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
            <button
              onClick={addField}
              className="w-full bg-violet-400 text-white py-1 px-4 rounded-md hover:bg-violet-300"
            >
              Add Field
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">Fields</h3>
            {fields.map((field, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded-lg">
                <p>
                  Top-Left : ({field.topLeft.x}, {field.topLeft.y})
                </p>
                <p>
                  Bottom-Right: ({field.bottomRight.x}, {field.bottomRight.y})
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isSubmit}
            className="w-full bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-400"
          >
            {isSubmit ? "Saving..." : "Save Template"}
          </button>
        </div>
      </div>

      <div className="flex-1 h-screen flex justify-center items-center bg-gray-50 p-8">
        {image ? (
          <img
            alt="preview"
            src={image}
            className="max-w-full max-h-full object-contain shadow-lg cursor-crosshair"
            onClick={imageCoords}
          />
        ) : (
          <div className="text-gray-400 text-lg">
            Upload a template to begin
          </div>
        )}
      </div>
    </div>
  );
};

export default Cert;
