import { useQuery } from '@tanstack/react-query';
import likeService from '../lib/services/like-service';
import type { ToggleLikeResponseT } from '../typs/like/like';

const useGetLikeStatus = (vehicleId?: string) => {
  return useQuery<ToggleLikeResponseT>({
    queryKey: ['likes', 'status', vehicleId],
    queryFn: () => likeService.getLikeStatus({ vehicleId: vehicleId! }),
    enabled: !!vehicleId,
    staleTime: 30_000,
  });
};

export default useGetLikeStatus;
