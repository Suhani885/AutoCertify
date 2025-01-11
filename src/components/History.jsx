import React from "react";

const History = ({ certificates, onDownload, formatDate }) => {
  if (certificates.length === 0) {
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No certificates generated yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 p-6 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-200 transition-colors">
              <svg
                className="w-6 h-6 text-violet-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              ZIP
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(cert.generatedAt)}
            </div>
          </div>

          <button
            onClick={() => onDownload(cert.downloadUrl)}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Certificates
          </button>
        </div>
      ))}
    </div>
  );
};

export default History;
