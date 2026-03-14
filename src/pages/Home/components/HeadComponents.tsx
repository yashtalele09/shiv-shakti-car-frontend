import Search from "../../../components/mobail-header/Search";
import car from "../../../assets/cars.jpg";

const HeadComponents = () => {
  return (
    <div
      className="w-full relative h-[42vh] z-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${car})` }}>
      {/* overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD9C9]/80 to-[#CDC3FF]/80"></div>

      <div className="w-full px-2 flex flex-col items-center gap-4 absolute top-45 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <Search />

        <h1 className="text-[20px] drop-shadow-[0_0_5px_rgba(0,0,0,0.2)] text-[#3B2A5A] font-inter font-semibold">
          Welcome to Shiv Shakti Car Bazar
        </h1>

        <p className="text-[14px] drop-shadow-[0_0_5px_rgba(0,0,0,0.2)] text-[#333333] text-center">
          Find your dream car at the best price. Buy, sell, and explore verified
          listings with ease.
        </p>

        <button className="w-[40%] bg-black text-white py-2 rounded-full">
          Explore Cars
        </button>
      </div>
    </div>
  );
};

export default HeadComponents;
