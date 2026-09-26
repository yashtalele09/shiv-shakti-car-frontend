import { useQuery } from '@tanstack/react-query';
import bannerService from '../../../lib/services/banner-service';

const useGetBanner = () => {
  return useQuery({
    queryKey: ['banner'],
    queryFn: bannerService.getBanner,
    staleTime: 5 * 60 * 1000, // 5 min — banner rarely changes
    select: (res) => res.data,
  });
};

export default useGetBanner;
