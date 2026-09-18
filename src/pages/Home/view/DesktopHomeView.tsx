import { useEffect, useState } from 'react';
import CarCarousel from '../components/desktop/BannerCorousal';
import TypeButtons from '../components/desktop/TypeButtons';
import SectionHeading from '../components/desktop/SectionHeading';
import CardCarousel from '../components/desktop/CardCorousal';
import useGetFeaturedVehicleMutation from '../hooks/useGetFeaturedVehicle';
import useGetReviewsMutation from '../hooks/useGetReviews';
import BrandButtonsFiltersDesktop from '../components/desktop/BrandBottonFilter';
import ServicesSection from '../components/desktop/ServiceSection';
import BeltCarousel from '../components/desktop/BeltCorousal';
import Review from '../components/desktop/Review';
import FAQ from '../components/desktop/Faq';

export const dummySlides = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2069&auto=format&fit=crop',
    eyebrow: 'CERTIFIED PRE-OWNED',
    title: 'Find your next car, verified end to end',
    subtitle:
      'Every listing clears a 200-point inspection before it reaches you.',
    ctaLabel: 'Browse inventory',
    onCtaClick: () => console.log('Browse inventory clicked'),
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop',
    eyebrow: 'TRADE-IN',
    title: 'Trade in, drive away the same day',
    subtitle: 'Instant valuation, transparent pricing, zero haggling.',
    ctaLabel: 'Get your valuation',
    onCtaClick: () => console.log('Valuation clicked'),
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop',
    eyebrow: 'FINANCING',
    title: 'Easy EMIs, approved in minutes',
    subtitle: 'Flexible loan tenures starting at 8.5% interest.',
    ctaLabel: 'Check eligibility',
    onCtaClick: () => console.log('Eligibility clicked'),
  },
  {
    id: '4',
    image:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2071&auto=format&fit=crop',
    eyebrow: 'TRUSTED BY THOUSANDS',
    title: "Pune's most trusted pre-owned car marketplace",
    subtitle: '10,000+ happy owners and counting.',
    ctaLabel: 'See customer stories',
    onCtaClick: () => console.log('Stories clicked'),
  },
];

const DesktopHomeView = () => {
  const [selectedType, setSelectedType] = useState<string | null>('All');

  const { mutate: fetchVehicles, data: vehicleData } =
    useGetFeaturedVehicleMutation({
      onError: (error) => console.error('Failed to fetch:', error),
    });

  const { mutate: fetchReviews, data: reviewData } = useGetReviewsMutation({
    onError: (error) => console.error('Failed to fetch:', error),
  });

  useEffect(() => {
    fetchVehicles({ body_type: selectedType || 'All' });
  }, [selectedType]);

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="bg-[#F8FAFC] pt-10">
      <CarCarousel slides={dummySlides} />
      <div className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] p-5">
        <SectionHeading title="Featured Cars" eyebrow="New" />
        <TypeButtons
          activeType={selectedType}
          setActiveType={setSelectedType}
        />
        <div className="flex min-w-0 items-center justify-center">
          <CardCarousel vehicles={vehicleData?.vehicleData || []} />
        </div>
      </div>
      <div className="w-full overflow-x-hidden bg-[#F8FAFC] p-5">
        <SectionHeading title="Search by Brand" eyebrow="" />
        <BrandButtonsFiltersDesktop />
      </div>
      <div className="w-full overflow-x-hidden bg-[#F8FAFC] p-5">
        <SectionHeading title="Our Services" eyebrow="" />
        <ServicesSection />
      </div>
      <div className="mt-5 flex flex-col items-center justify-center overflow-x-hidden bg-[#F8FAFC] p-5">
        <div className="w-full">
          <SectionHeading title="Customer Reviews" eyebrow="" />
        </div>
        <Review reviews={reviewData?.data?.reviews || []} />
      </div>
      <div className="mt-5 w-full overflow-x-hidden bg-[#F8FAFC] p-5">
        <div className="w-full">
          <SectionHeading title="Frequently Asked Questions" eyebrow="" />
        </div>
        <FAQ />
      </div>
      <div className="flex w-full items-center justify-center overflow-x-hidden bg-[#F8FAFC] p-5">
        <BeltCarousel />
      </div>
    </div>
  );
};

export default DesktopHomeView;
