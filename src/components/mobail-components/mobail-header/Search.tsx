import { SearchIcon } from 'lucide-react';
import { useTypewriter } from 'react-simple-typewriter';

const Search = () => {
  const [text] = useTypewriter({
    words: ['Search by Name', 'Search by Brand', 'Search by Year'],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="relative h-10 w-[85%]">
      <input
        type="text"
        placeholder={text}
        className="h-full w-full rounded-full border-none bg-black/60 p-3 text-white outline-none"
      />
      <button className="absolute top-1/2 right-4 -translate-y-1/2 transform">
        <SearchIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default Search;
