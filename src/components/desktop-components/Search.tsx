import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon, XIcon } from 'lucide-react';
import { useTypewriter } from 'react-simple-typewriter';

type SearchProps = {
  onSearch?: () => void;
  /** 'overlay' = full-width dark bar (mobile slide-in). 'inline' = compact bar for a desktop navbar. */
  variant?: 'overlay' | 'inline';
  className?: string;
};

const Search = ({
  onSearch,
  variant = 'overlay',
  className = '',
}: SearchProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [focused, setFocused] = useState(false);

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

  const handleClear = () => setQuery('');

  const isInline = variant === 'inline';

  return (
    <div
      className={`relative h-10 ${isInline ? 'w-full' : 'w-[85%]'} ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={text}
        className={`h-full w-full rounded-full border pr-16 pl-4 text-sm transition-all duration-200 outline-none ${
          isInline
            ? `border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#FFA1A1]/60 ${
                focused ? 'shadow-sm' : ''
              }`
            : 'border-none bg-black/60 p-3 text-white placeholder:text-white/70'
        }`}
      />

      {query && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className={`absolute top-1/2 right-11 -translate-y-1/2 transform ${
            isInline ? 'text-gray-400 hover:text-gray-600' : 'text-white/70'
          }`}
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}

      <button
        onClick={handleSearch}
        aria-label="Search"
        className={`absolute top-1/2 right-4 -translate-y-1/2 transform transition-colors ${
          isInline ? 'text-gray-500 hover:text-gray-800' : 'text-white'
        }`}
      >
        <SearchIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Search;
