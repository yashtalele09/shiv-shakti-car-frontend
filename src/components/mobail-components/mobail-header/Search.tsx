import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon, XIcon } from 'lucide-react';
import { useTypewriter } from 'react-simple-typewriter';

const Search = ({ onSearch }: { onSearch?: () => void }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const [text] = useTypewriter({
    words: ['Search by Name', 'Search by Brand', 'Search by Year'],
    loop: true,
    delaySpeed: 2000,
  });

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/vehicle?search=${encodeURIComponent(trimmed)}`);
    onSearch?.(); // lets Header close the search overlay if it passed this prop
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative h-10 w-[85%]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={text}
        className="h-full w-full rounded-full border-none bg-black/60 p-3 pr-16 text-white outline-none"
      />

      {query && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-11 -translate-y-1/2 transform"
        >
          <XIcon className="h-4 w-4 text-white/70" />
        </button>
      )}

      <button
        onClick={handleSearch}
        aria-label="Search"
        className="absolute top-1/2 right-4 -translate-y-1/2 transform"
      >
        <SearchIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default Search;
