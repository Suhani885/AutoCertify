import React from "react";

const DashSidebar = ({
  activeSection,
  setActiveSection,
  isCollapsed,
  setIsCollapsed,
}) => {
  const menuItems = [
    {
      id: "home",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      label: "Home",
    },
    {
      id: "history",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: "Generated History",
    },
    {
      id: "templates",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      label: "My Templates",
    },
  ];

  return (
    <div
      className={`fixed md:relative h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-[-12px] top-4 bg-violet-500 text-white p-1 rounded-full hidden md:block"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center p-3 mb-2 rounded-lg transition-colors ${
              activeSection === item.id
                ? "bg-violet-500 text-white"
                : "text-gray-600 hover:bg-violet-50"
            }`}
          >
            {item.icon}
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashSidebar;
