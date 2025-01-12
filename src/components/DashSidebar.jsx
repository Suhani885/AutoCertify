import React from "react";

const SidebarButton = ({ name, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
      isActive ? "bg-violet-500 text-white" : "hover:bg-violet-50 text-gray-600"
    }`}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-5 h-5 mr-3"
    >
      {icon}
    </svg>
    <span className="font-medium">{name}</span>
  </button>
);

const DashSidebar = ({ activeSection, setActiveSection, isSidebarOpen }) => {
  const sidebarItems = [
    {
      name: "Home",
      icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    },
    {
      name: "History",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      ),
    },
    {
      name: "Templates",
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </>
      ),
    },
    {
      name: "Trash",
      icon: (
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      ),
    },
  ];

  return (
    <div
      className={`fixed md:relative w-64 h-[calc(100vh-4rem)] bg-white shadow-lg md:shadow-none transition-transform duration-300 z-40
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
    >
      <div className="p-4 flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <SidebarButton
            key={item.name}
            name={item.name}
            icon={item.icon}
            isActive={activeSection === item.name.toLowerCase()}
            onClick={() => setActiveSection(item.name.toLowerCase())}
          />
        ))}
      </div>
    </div>
  );
};

export default DashSidebar;
