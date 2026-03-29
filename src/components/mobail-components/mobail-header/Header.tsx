import { useState, useEffect } from "react";
import logo from "../../../assets/logdumy.png";
import Search from "./Search";

const Header = ({ expanded }: { expanded: boolean }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full z-50 px-5 flex items-center transition-all duration-300 ease-in-out
      ${expanded ? "absolute justify-center" : "fixed justify-between"}
      
      ${
        expanded
          ? "bg-gradient-to-r from-[#FFA1A1] to-[#FFD9A1] shadow-lg"
          : scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md border-b"
            : "bg-transparent backdrop-blur-sm"
      }
      `}
      style={{ height: "60px" }}>
      {expanded ? (
        <div className="w-full max-w-xl flex items-center justify-center animate-[fadeIn_.3s_ease]">
          <Search />
        </div>
      ) : (
        <>
          {/* 🔹 Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="logo"
              className="w-16 h-8 object-contain drop-shadow-sm"
            />
            <div className="h-5 w-[1px] bg-gray-300" />
          </div>

          {/* 🔹 Right Section */}
          <div className="flex items-center gap-2">
            {/* 🔔 Notification */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-500 transition">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            {/* ⚙️ Settings */}
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-500 transition">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-[1px] h-5 bg-gray-300 mx-1" />

            {/* 👤 Avatar */}
            <button className="relative">
              <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#FFA1A1] to-[#FFD9A1] shadow-md">
                <div className="w-full h-full rounded-full flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-br from-red-400 to-red-500">
                  DD
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
