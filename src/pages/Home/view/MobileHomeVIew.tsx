import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import BannerCorousal from '../components/mobile/BannerCorousal';
import HeadComponents from '../components/mobile/HeadComponents';
import TypeButtonFilter from '../components/mobile/TypeButtonFilter';
import CardCorousal from '../components/mobile/CardCorousal';
import BrandButtonsFilters from '../components/mobile/BrandButtonsFilters';
import BrandCarousel from '../components/mobile/BeltCorousal';
import ServicesSection from '../components/mobile/ServicesSection';
import Review from '../components/mobile/Review';
import FAQ from '../components/mobile/Faq';
import { motion, type Variants } from 'framer-motion';
import useGetFeaturedVehicleMutation from '../hooks/useGetFeaturedVehicle';
import useGetReviewsMutation from '../hooks/useGetReviews';
import MobailFooter from '../../../components/mobail-components/mobail-footer/MobailFooter';

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
  <div className="mt-6 mb-2 flex items-center gap-2">
    <span className="h-5 w-[3px] rounded-full bg-purple-500" />
    <h2 className="text-sm font-semibold text-[#1a0330]">
      {label}
      {accent && (
        <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-500">
          {accent}
        </span>
      )}
    </h2>
  </div>
);

// ─── Home Component ───────────────────────────────────

const Home = () => {
  const { expanded, setExpanded } = useOutletContext<any>();
  const [selectedType, setSelectedType] = useState<string | null>('All');
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

  const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);

  const { mutate: fetchVehicles, data: vehicleData } =
    useGetFeaturedVehicleMutation({
      onSuccess: () => setIsVehiclesLoading(false),
      onError: (error) => {
        setIsVehiclesLoading(false);
        console.error('Failed to fetch:', error);
      },
    });

  const { mutate: fetchReviews, data: reviewData } = useGetReviewsMutation({
    onError: (error) => console.error('Failed to fetch:', error),
  });

  useEffect(() => {
    if (expanded) {
      fetchReviews();
    }
  }, [expanded]);

  useEffect(() => {
    if (expanded) {
      setIsVehiclesLoading(true);
      fetchVehicles({ body_type: selectedType || 'All' });
    }
  }, [expanded, selectedType]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#FCF5F5]">
      {/* Header */}
      <motion.div
        animate={{ opacity: expanded ? 0 : 1 }}
        className="relative z-10"
      >
        <HeadComponents />
      </motion.div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute left-0 z-20 flex w-full flex-col items-center rounded-t-[24px] transition-all duration-500 ease-in-out ${
          expanded
            ? 'top-0 mt-15 h-[calc(100%-3.75rem)] overflow-y-auto'
            : 'top-[42%] h-[58%] overflow-hidden'
        }`}
        style={{
          background:
            'linear-gradient(160deg, #fdf4ff 0%, #fce7f3 40%, #f5f0ff 100%)',
        }}
      >
        {/* Drag Handle */}
        <div className="mt-3 mb-2 h-[5px] w-10 rounded-full bg-purple-300" />

        {/* Banner */}
        <div className="flex w-full justify-center">
          <BannerCorousal />
        </div>

        {/* Collapsed Hint */}
        {!expanded && (
          <div className="mt-3 mb-4 flex flex-col items-center">
            <p className="text-xs text-purple-400">Swipe up to explore</p>
            <ChevronDown className="mt-1 animate-bounce text-purple-400" />
          </div>
        )}

        {/* Expanded Content */}
        {expanded && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-[95%] pb-10"
          >
            <motion.div variants={fadeUp}>
              <SectionHeading label="Featured Cars" accent="New" />
              <TypeButtonFilter
                activeType={selectedType}
                setActiveType={setSelectedType}
              />
              <CardCorousal
                vehicles={vehicleData?.vehicleData || []}
                selectedType={selectedType || ''}
                isLoading={isVehiclesLoading}
              />
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
              <Review reviews={reviewData?.data?.reviews || []} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <SectionHeading label="FAQs" />
              <FAQ />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4">
              <BrandCarousel />
            </motion.div>

            {expanded && <MobailFooter />}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
