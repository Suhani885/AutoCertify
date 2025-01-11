import React from "react";

const Templates = ({ templates, onUseTemplate }) => {
  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No templates saved yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 p-6"
        >
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img
              src={template.previewUrl}
              alt={`Template ${index + 1}`}
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {formatDate(template.createdAt)}
            </span>
            <button
              onClick={() => onUseTemplate(template)}
              className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Use Template
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Templates;
