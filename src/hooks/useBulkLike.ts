import { useQuery } from '@tanstack/react-query';
import likeService from '../lib/services/like-service';
import type { GetBulkLikesResponseT } from '../typs/like/like';

// Pass the vehicle ids shown on the current listing page (max 50)
const useGetBulkLikes = (vehicleIds: string[]) => {
  const ids = [...new Set(vehicleIds)].sort();

  return useQuery<GetBulkLikesResponseT>({
    queryKey: ['likes', 'bulk', ids],
    queryFn: () => likeService.getBulkLikes({ vehicleIds: ids }),
    enabled: ids.length > 0,
    staleTime: 30_000,
  });
};

export default useGetBulkLikes;
