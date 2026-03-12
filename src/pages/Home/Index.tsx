import { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import BannerCorousal from "./components/BannerCorousal";
import HeadComponents from "./components/HeadComponents";
import TypeButtonFilter from "./components/TypeButtonFilter";
import CardCorousal from "./components/CardCorousal";

const Home = () => {
  const { expanded, setExpanded } = useOutletContext<any>();
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const startY = useRef(0);
  const endY = useRef(0);

  const isNoSwipe = (target: HTMLElement) => {
    return target.closest("[data-no-swipe='true']");
  };

  const handleTouchStart = (e: any) => {
    if (isNoSwipe(e.target)) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: any) => {
    if (isNoSwipe(e.target)) return;
    endY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: any) => {
    if (isNoSwipe(e.target)) return;

    const distance = startY.current - endY.current;

    if (distance > 50) setExpanded(true);
    else if (distance < -50) setExpanded(false);
  };

  return (
    <div className="w-full pb-15 relative bg-white">
      {/* Header Content */}
      <div
        className={`transition-all duration-300 ${
          expanded ? "opacity-0" : "opacity-100"
        }`}>
        <HeadComponents />
      </div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute left-0 w-full flex flex-col gap-7 items-center
        rounded-t-3xl bg-pink-50 shadow-[0_-6px_10px_rgba(0,0,0,0.3)]
        transition-all duration-500 z-20
        ${expanded ? "top-0 h-screen overflow-y-auto" : "top-[40vh] h-[60vh]"}`}>
        {/* Drag Handle */}
        <div className="w-[30%] bg-gray-600 rounded-full h-[5px] mt-5"></div>

        {/* Arrow when expanded */}
        {/* {expanded && (
          <div className="flex flex-col items-center mt-5 text-gray-600 animate-bounce">
            <ChevronUp size={32} />
            <p className="text-sm font-medium">Swipe Down to Close</p>
          </div>
        )} */}

        {/* Carousel */}
        <div
          className={`${
            expanded ? "mt-5" : "mt-0"
          } transition-all flex items-center justify-center duration-300`}>
          <BannerCorousal />
        </div>

        {expanded && (
          <div className="w-[95%]">
            <TypeButtonFilter />
            <CardCorousal />
          </div>
        )}

        {/* Arrow when collapsed */}
        {!expanded && (
          <div className="flex flex-col items-center mt-3 text-gray-600 animate-bounce">
            <p className="text-sm font-medium">Swipe Up to Explore</p>
            <ChevronDown size={32} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
