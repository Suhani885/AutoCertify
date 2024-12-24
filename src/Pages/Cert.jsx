import React, { useState } from "react";

const Cert = ({
  fields = [],
  setFields = () => {},
  certificateImage = null,
  selectedField = null,
  onSave = () => {},
}) => {
  const [Image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const imageCoordinates = (event) => {
    const bounds = event.target.getBoundingClientRect();
    const x = event.pageX - bounds.left;
    const y = event.pageY - bounds.top;
    // const a = event.pageX - this.offsetLeft;
    // const b = event.pageY - this.offsetTop;
    // const cw = this.current.clientWidth;
    // const ch = this.clientHeight;
    // const iw = this.naturalWidth;
    // const ih = this.naturalHeight;
    // const px = (x / cw) * iw;
    // const py = (y / ch) * ih;
    console.log("(X,Y):", { x, y });
    // console.log("(X,Y):", { cw, b });
  };

  const addField = () => {};
  const updateField = (id, key, value) => {};
  const removeField = (id) => {};

  return (
    <div className="h-screen w-full flex flex-row bg-white">
      <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <img
            src="src/assets/certLogo.png"
            alt="Logo"
            className="max-h-20 object-contain"
          />
        </div>

        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Template
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
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
                {certificateImage ? certificateImage.name : "Upload template"}
              </span>
              <input
                type="file"
                className="Hidden"
                accept="image/*"
                onChange={onImageChange}
              />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Fields</h3>
            <button
              onClick={addField}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {fields.map((field) => (
            <div
              key={field.id}
              className={`mb-4 p-3 rounded-lg ${
                selectedField === field.id
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50"
              }`}
            >
              <div className="grid grid-cols-2 gap-2"></div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onSave}
            className="w-full bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-400 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>
        </div>
      </div>
      <div className="text-center h-screen w-full flex justify-center">
        {Image && (
          <img
            alt="preview"
            src={Image}
            className="mt-4 max-w-full p-6 rounded-md"
            onClick={imageCoordinates}
          />
        )}
      </div>
    </div>
  );
};

export default Cert;
