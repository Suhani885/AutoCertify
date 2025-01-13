import React from "react";

const Templates = ({ templates, onDownload, baseURL }) => {
  const FileIcon = () => (
    <svg
      className="w-20 h-20 text-violet-500 mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );

  if (!templates?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <FileIcon />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Templates Available
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all group"
        >
          {template.template_path ? (
            <div className="mb-4 rounded-lg overflow-hidden aspect-video">
              <img
                src={`${baseURL}/media/${template.template_path}`}
                alt={template.tempplate_name || "Template"}
                className="w-full h-full object-cover"
              />
              <div className="hidden">
                <FileIcon />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <FileIcon />
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-600 truncate font-medium text-center">
              {template.tempplate_name || "Template Name"}
            </p>
          </div>

          <button
            onClick={() => onDownload(template)}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
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
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default Templates;
