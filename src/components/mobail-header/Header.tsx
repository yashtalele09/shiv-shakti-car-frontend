import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import logo from "../../assets/logdumy.png";
import Search from "./Search";

const Header = ({ expanded }: { expanded: boolean }) => {
  return (
    <header
      className={`h-15 fixed px-4 w-full z-50 flex items-center transition-all duration-300 ${
        expanded
          ? "bg-[#FFA1A1]/90 shadow-md justify-center"
          : "bg-transparent justify-between"
      }`}>
      {expanded ? (
        <Search />
      ) : (
        <>
          <img src={logo} alt="logo" className="w-16 h-8 shadow-lg" />

          <Avatar>
            <AvatarImage
              src="https://example.com/avatar.jpg"
              alt="John Doe"
              className="w-8 h-8"
            />
            <AvatarFallback className="w-8 h-8 bg-gray-500 text-white">
              JD
            </AvatarFallback>
          </Avatar>
        </>
      )}
    </header>
  );
};

export default Header;
