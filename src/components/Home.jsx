import React from "react";
import { useNavigate } from "react-router-dom";

const RecentActivity = ({ certificates }) => {
  const recentCerts = certificates.slice(0, 3);
  return (
    <div className="space-y-3">
      {recentCerts.map((cert, index) => (
        <div
          key={index}
          className="flex items-center truncate justify-between bg-gray-50 p-2 rounded"
        >
          <span className="text-sm text-gray-600">{cert.zip_file_name}</span>
        </div>
      ))}
    </div>
  );
};

const Home = ({ userEmail, certificates }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Welcome {userEmail}!</h2>

        <button
          onClick={() => navigate("/main")}
          className="mt-4 w-full bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition-colors"
        >
          Create New Certificate
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Recently Created</h2>
        <RecentActivity certificates={certificates} />
      </div>
    </div>
  );
};

export default Home;
