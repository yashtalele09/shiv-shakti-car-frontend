import { useState, useEffect } from "react";
import { images } from "../constants";

const BannerCorousal = () => {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  const extendedImages = [...images, images[0]]; // clone first image

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (current === images.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 700); // match animation duration

      setTimeout(() => {
        setTransition(true);
      }, 750);
    }
  }, [current, images.length]);

  return (
    <div className="w-[95%] h-65 rounded-3xl overflow-hidden relative shadow-[0_6px_10px_rgba(0,0,0,0.4)] bg-gray-500">
      {/* Image Wrapper */}
      <div
        className={`flex h-full ${
          transition ? "transition-transform duration-700 ease-in-out" : ""
        }`}
        style={{ transform: `translateX(-${current * 100}%)` }}>
        {extendedImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="banner"
            className="w-full h-full object-cover flex-shrink-0"
          />
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
