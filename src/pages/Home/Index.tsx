import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown } from "lucide-react";
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

// ─── Animations ─────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Section Heading ───────────────────────────────────

const SectionHeading = ({ label, accent }: any) => (
  <div className="flex items-center gap-2 mt-6 mb-2">
    <span className="w-[3px] h-5 bg-purple-500 rounded-full" />
    <h2 className="text-sm font-semibold text-[#1a0330]">
      {label}
      {accent && (
        <span className="ml-2 text-xs text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full">
          {accent}
        </span>
      )}
    </h2>
  </div>
);

// ─── Home Component ───────────────────────────────────

const Home = () => {
  const { expanded, setExpanded } = useOutletContext<any>();
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const startY = useRef(0);
  const endY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    endY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const distance = startY.current - endY.current;

    if (distance > 50) {
      setExpanded(true);
    } else if (distance < -50) {
      if (sheetRef.current?.scrollTop === 0) {
        setExpanded(false);
      }
    }
  };

  useEffect(() => {
    if (expanded && sheetRef.current) {
      sheetRef.current.scrollTo({ top: 0 });
    }
  }, [expanded]);

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <motion.div
        animate={{ opacity: expanded ? 0 : 1 }}
        className="relative z-10">
        <HeadComponents />
      </motion.div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          absolute left-0 w-full z-20 flex flex-col items-center
          rounded-t-[24px]
          transition-all duration-500 ease-in-out
          ${
            expanded
              ? "top-0 h-screen mt-15 overflow-y-auto"
              : "top-[42vh] min-h-[58vh]"
          }
        `}
        style={{
          background:
            "linear-gradient(160deg, #fdf4ff 0%, #fce7f3 40%, #f5f0ff 100%)",
        }}>
        {/* Drag Handle */}
        <div className="w-10 h-[5px] bg-purple-300 rounded-full mt-3 mb-2" />

        {/* Banner */}
        <div className="w-full flex justify-center">
          <BannerCorousal />
        </div>

        {/* Collapsed Hint */}
        {!expanded && (
          <div className="flex flex-col items-center mt-3 mb-4">
            <p className="text-xs text-purple-400">Swipe up to explore</p>
            <ChevronDown className="text-purple-400 mt-1 animate-bounce" />
          </div>
        )}

        {/* Expanded Content */}
        {expanded && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-[95%] pb-10">
            <motion.div variants={fadeUp}>
              <SectionHeading label="Featured Cars" accent="New" />
              <TypeButtonFilter />
              <CardCorousal />
            </motion.div>

            <motion.div variants={fadeUp}>
              <SectionHeading label="Search by Brand" />
              <BrandButtonsFilters />
            </motion.div>

            <motion.div variants={fadeUp}>
              <SectionHeading label="Our Services" />
              <ServicesSection />
            </motion.div>

            <motion.div variants={fadeUp}>
              <SectionHeading label="Customer Reviews" accent="⭐" />
              <Review />
            </motion.div>

            <motion.div variants={fadeUp}>
              <SectionHeading label="FAQs" />
              <FAQ />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4">
              <BrandCarousel />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
