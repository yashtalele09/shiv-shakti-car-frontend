import { useQuery } from '@tanstack/react-query';
import likeService from '../lib/services/like-service';
import type { GetBulkLikesResponseT } from '../typs/like/like';
import { getAuthToken } from '../helper/auth';

const useGetBulkLikes = (vehicleIds: string[]) => {
  const ids = [...new Set(vehicleIds)].sort();
  const isLoggedIn = Boolean(getAuthToken());

  return useQuery<GetBulkLikesResponseT>({
    queryKey: ['likes', 'bulk', ids, isLoggedIn],
    queryFn: () => likeService.getBulkLikes({ vehicleIds: ids }),
    enabled: ids.length > 0,
    staleTime: 30_000,
  });
};

export default useGetBulkLikes;
