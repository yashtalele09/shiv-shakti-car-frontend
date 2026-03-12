import { SearchIcon } from "lucide-react";
import { useTypewriter } from "react-simple-typewriter";

const Search = () => {
  const [text] = useTypewriter({
    words: ["Search by Name", "Search by Brand", "Search by Year"],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="relative w-[85%] h-10">
      <input
        type="text"
        placeholder={text}
        className="w-full h-full rounded-full p-3 border-none outline-none bg-black/60 text-white"
      />
      <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <SearchIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default Search;
