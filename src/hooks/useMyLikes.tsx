import { useQuery } from '@tanstack/react-query';
import likeService from '../lib/services/like-service';
import { getAuthToken } from '../helper/auth';

const useMyLikes = () => {
  const isLoggedIn = Boolean(getAuthToken());

  return useQuery({
    queryKey: ['likes', 'mine', isLoggedIn],
    queryFn: () => likeService.getMyLikes(),
    enabled: isLoggedIn,
    staleTime: 30_000,
    select: (res: any): Set<string> =>
      new Set((res?.data?.vehicleIds ?? []).map(String)),
  });
};

export default useMyLikes;
