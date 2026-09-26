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
      <CarCarousel />
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
