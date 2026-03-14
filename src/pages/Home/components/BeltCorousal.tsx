import { brands } from "../constants";

const BrandCarousel = () => {
  const allBrands = [...brands, ...brands]; // duplicate for smooth loop

  return (
    <>
      <style>
        {`
          @keyframes scrollBrands {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .scroll-brands {
            animation: scrollBrands 20s linear infinite;
          }

          .scroll-brands:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="w-full overflow-hidden p-4 shadow-2xl mt-4">
        <div className="flex gap-6 w-max scroll-brands">
          {allBrands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-white rounded-xl shadow-md w-32 h-20">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BrandCarousel;
