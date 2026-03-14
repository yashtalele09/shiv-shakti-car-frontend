import { useState, useEffect } from "react";
import { images, Slogans } from "../constants";

const BannerCorousal = () => {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  const extendedImages = [...Slogans, Slogans[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (current === Slogans.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 700);

      setTimeout(() => {
        setTransition(true);
      }, 750);
    }
  }, [current]);

  return (
    <div className="w-[95%] h-65 rounded-2xl bg-gray-600 overflow-hidden relative shadow-[0_6px_10px_rgba(0,0,0,0.4)]">
      {/* Image Wrapper */}
      <div
        className={`flex h-full ${
          transition ? "transition-transform duration-700 ease-in-out" : ""
        }`}
        style={{ transform: `translateX(-${current * 100}%)` }}>
        {extendedImages.map((item, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <img
              src={item.url}
              alt="banner"
              className="w-full h-full object-cover"
            />

            {/* Text Overlay */}
            <div className="absolute bottom-10 left-5">
              <h1 className="text-2xl font-bold text-[#FFD700] drop-shadow-[0_0_5px_rgba(0,0,0,0.6)]">
                {item.title}
              </h1>
              <p className="text-sm mt-2 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.6)]">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              current % images.length === index ? "bg-white w-5" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCorousal;
