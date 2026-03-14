import { Outlet } from "react-router-dom";
import Header from "../components/mobail-header/Header";
import { useState } from "react";

const MobileLayout = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header expanded={expanded} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet context={{ expanded, setExpanded }} />
      </main>

      {/* Navbar */}
      <nav
        className={`fixed z-50 left-0 right-0 h-16 bg-white border-t flex justify-around items-center shadow-lg
        transition-all duration-500
        ${
          expanded
            ? "bottom-0 opacity-100 translate-y-0"
            : "-bottom-20 opacity-0 translate-y-full"
        }`}>
        <button className="text-sm font-medium">Home</button>
        <button className="text-sm font-medium">Search</button>
        <button className="text-sm font-medium">Profile</button>
      </nav>
    </div>
  );
};

export default MobileLayout;
