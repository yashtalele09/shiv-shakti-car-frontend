import { types } from "../constants";

const TypeButtonFilter = () => {
  return (
    <div
      data-no-swipe="true"
      className="w-full flex flex-nowrap items-center overflow-x-auto gap-3 px-4 rounded-2xl h-20 scroll-smooth touch-pan-x no-scrollbar bg-pink-100">
      {types.map((type) => (
        <button
          key={type.name}
          className="min-w-[120px] h-[70%] border border-gray-200 rounded-xl flex-shrink-0 bg-linear-to-b from-[#FFA1A1] to-[#253C6F] text-white font-bold transition-all duration-300 text-sm shadow-lg active:scale-95 flex items-center justify-center gap-2 px-2">
          {type.icon && (
            <img
              src={type.icon}
              alt={type.name}
              className="w-6 h-6 object-contain"
            />
          )}
          {type.name}
        </button>
      ))}
    </div>
  );
};

export default TypeButtonFilter;
