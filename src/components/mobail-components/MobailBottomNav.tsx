import { Car, Home, Phone, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface MobailBottomNavProps {
  expanded: boolean;
}

const MobailBottomNav = ({ expanded }: MobailBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItemClass = (path: string) =>
    `p-2 rounded-full transition-all duration-300 transform ${
      isActive(path)
        ? "text-red-300 bg-white/30 scale-110 shadow-md"
        : "text-black scale-100"
    }`;

  return (
    <nav
      className={`fixed z-50 left-0 right-0 h-16 
      bg-linear-to-r from-[#FFA1A1] to-[#FFD9A1] 
      flex justify-around items-center 
      shadow-inner shadow-black/20
      transition-all duration-500
      ${
        expanded
          ? "bottom-0 opacity-100 translate-y-0"
          : "-bottom-20 opacity-0 translate-y-full"
      }`}>
      <button onClick={() => navigate("/")} className={navItemClass("/")}>
        <Home fill={isActive("/") ? "currentColor" : "none"} />
      </button>

      <button
        onClick={() => navigate("/vehicle")}
        className={navItemClass("/vehicle")}>
        <Car fill={isActive("/vehicle") ? "currentColor" : "none"} />
      </button>

      <button
        onClick={() => navigate("/contact")}
        className={navItemClass("/contact")}>
        <Phone fill={isActive("/contact") ? "currentColor" : "none"} />
      </button>

      <button
        onClick={() => navigate("/profile")}
        className={navItemClass("/profile")}>
        <User fill={isActive("/profile") ? "currentColor" : "none"} />
      </button>
    </nav>
  );
};

export default MobailBottomNav;
