import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import BannerCorousal from "./components/BannerCorousal";
import HeadComponents from "./components/HeadComponents";
import TypeButtonFilter from "./components/TypeButtonFilter";
import CardCorousal from "./components/CardCorousal";
import BrandButtonsFilters from "./components/BrandButtonsFilters";
import BrandCarousel from "./components/BeltCorousal";
import ServicesSection from "./components/ServicesSection";
import Review from "./components/Review";
import FAQ from "./components/Faq";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

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

    // expand
    if (distance > 50) {
      setExpanded(true);
    }

    // collapse only if user is at top
    else if (distance < -50) {
      if (sheetRef.current && sheetRef.current.scrollTop <= 0) {
        setExpanded(false);
      }
    }
  };

  useEffect(() => {
    if (expanded && sheetRef.current) {
      sheetRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [expanded]);

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
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className={`${
            expanded ? "mt-5" : "mt-0"
          } transition-all flex items-center justify-center duration-300`}>
          <BannerCorousal />
        </motion.div>

        {expanded && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="w-[95%]">
            <motion.h3
              variants={fadeUp}
              className="pl-2 text-xl font-inter mt-2 text-gray-500 font-bold">
              Featured Cars
            </motion.h3>
            <TypeButtonFilter />
            <CardCorousal />
            <motion.h3
              variants={fadeUp}
              className="pl-2 text-xl font-inter mt-6 text-gray-500 font-bold">
              Search by Brands
            </motion.h3>
            <BrandButtonsFilters />
            <motion.h1
              variants={fadeUp}
              className="pl-2 text-xl font-inter mt-6 text-gray-500 font-bold">
              Services
            </motion.h1>
            <ServicesSection />
            <motion.h1
              variants={fadeUp}
              className="pl-2 text-xl font-inter mt-6 text-gray-500 font-bold">
              Customers Reviews
            </motion.h1>
            <Review />
            <motion.h1
              variants={fadeUp}
              className="pl-2 text-xl font-inter mt-6 text-gray-500 font-bold">
              FAQ
            </motion.h1>
            <FAQ />
            <BrandCarousel />
          </motion.div>
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
