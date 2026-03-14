import { useState } from "react";
import review from "../../../assets/car-costomer.png";

const reviews = [
  {
    name: "Rahul Roy",
    text: "I had an amazing experience purchasing my second-hand car from this service. The team was honest and helped me find the perfect car.",
    image: review,
  },
  {
    name: "Amit Sharma",
    text: "Great service and smooth buying process. Highly recommended for anyone looking for a used car.",
    image: review,
  },
  {
    name: "Rohit Verma",
    text: "Very professional team and transparent pricing. I’m very satisfied with my purchase.",
    image: review,
  },
];

const Review = () => {
  const [index, setIndex] = useState(0);

  const totalSlides = reviews.length + 1;

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="h-110 px-6 py-4 w-full bg-pink-100 rounded-xl mt-2">
      <div className="w-full h-[98%] rounded-2xl overflow-hidden relative">
        {/* Slider */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}>
          {/* Review Slides */}
          {reviews.map((item, i) => (
            <div key={i} className="min-w-full h-full relative">
              <img
                src={item.image}
                alt="review"
                className="w-full h-full object-cover"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Review Text */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm mt-1 leading-relaxed max-w-md">
                  {item.text}
                </p>
              </div>

              {/* Stars */}
              <div className="absolute bottom-[6px] right-6 text-yellow-400 text-lg">
                ★★★★☆
              </div>
            </div>
          ))}

          {/* View More Slide */}
          <div className="min-w-full h-full flex items-center justify-center bg-white">
            <button className="px-6 py-3 rounded-lg animate-bounce">
              <p className="text-orange-600 text-xl">View More Reviews</p>
            </button>
          </div>
        </div>

        {/* Left Button */}
        <button
          onClick={prevSlide}
          disabled={index === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 px-3 py-1 rounded-full backdrop-blur-sm
            ${
              index === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : index === totalSlides - 1
                  ? "bg-black/10 text-black"
                  : "bg-white/30 text-white"
            }`}>
          ❮
        </button>

        {/* Right Button (hidden on View More slide) */}
        {index !== totalSlides - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            ❯
          </button>
        )}

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === index ? "bg-gray-800" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
