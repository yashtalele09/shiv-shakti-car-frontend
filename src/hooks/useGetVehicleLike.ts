import { useQuery } from '@tanstack/react-query';
import likeService from '../lib/services/like-service';
import type { ToggleLikeResponseT } from '../typs/like/like';
import getAuthToken from '../helper/auth';

const useGetLikeStatus = (vehicleId?: string) => {
  const isLoggedIn = Boolean(getAuthToken());

  return useQuery<ToggleLikeResponseT>({
    queryKey: ['likes', 'status', vehicleId, isLoggedIn],
    queryFn: () => likeService.getLikeStatus({ vehicleId: vehicleId! }),
    enabled: !!vehicleId,
    staleTime: 30_000,
  });
};

export default useGetLikeStatus;
