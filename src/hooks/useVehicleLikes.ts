import { useMutation, useQueryClient } from '@tanstack/react-query';
import likeService from '../lib/services/like-service';
import type {
  GetBulkLikesResponseT,
  ToggleLikeInputT,
  ToggleLikeResponseT,
} from '../typs/like/like';

type LikeState = { liked: boolean; likesCount: number };

type UseToggleLikeMutationOptions = {
  onSuccess?: (data: ToggleLikeResponseT) => void;
  onError?: (error: any) => void;
};

type MutationContext = {
  previousStatus: [readonly unknown[], ToggleLikeResponseT | undefined][];
  previousBulk: [readonly unknown[], GetBulkLikesResponseT | undefined][];
  previousMine: [readonly unknown[], any][];
  vehicleId: string;
};

const getIds = (res: any): string[] =>
  Array.isArray(res?.data?.vehicleIds) ? res.data.vehicleIds.map(String) : [];

const useToggleLike = (options?: UseToggleLikeMutationOptions) => {
  const queryClient = useQueryClient();

  const writeEverywhere = (vehicleId: string, next: LikeState) => {
    queryClient.setQueriesData<ToggleLikeResponseT>(
      { queryKey: ['likes', 'status', vehicleId] },
      (old) => (old ? { ...old, data: next } : old)
    );

    queryClient.setQueriesData<GetBulkLikesResponseT>(
      { queryKey: ['likes', 'bulk'] },
      (old) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, [vehicleId]: next } };
      }
    );

    // update "my likes" so the heart colour changes instantly
    queryClient.setQueriesData<any>(
      { queryKey: ['likes', 'mine'] },
      (old: any) => {
        if (!old) return old;
        const ids = getIds(old).filter((id) => id !== String(vehicleId));
        if (next.liked) ids.push(String(vehicleId));
        return { ...old, data: { ...old.data, vehicleIds: ids } };
      }
    );
  };

  return useMutation<
    ToggleLikeResponseT,
    Error,
    ToggleLikeInputT,
    MutationContext
  >({
    mutationFn: (body) => likeService.toggleLike(body),

    onMutate: async ({ vehicleId }) => {
      await queryClient.cancelQueries({ queryKey: ['likes'] });

      const previousStatus = queryClient.getQueriesData<ToggleLikeResponseT>({
        queryKey: ['likes', 'status', vehicleId],
      });
      const previousBulk = queryClient.getQueriesData<GetBulkLikesResponseT>({
        queryKey: ['likes', 'bulk'],
      });
      const previousMine = queryClient.getQueriesData<any>({
        queryKey: ['likes', 'mine'],
      });

      // count from status/bulk
      const countState: LikeState = previousStatus
        .map(([, v]) => v?.data)
        .find(Boolean) ??
        previousBulk.map(([, v]) => v?.data?.[vehicleId]).find(Boolean) ?? {
          liked: false,
          likesCount: 0,
        };

      // liked flag: trust my-likes first (it's the reliable source)
      const mineCache = previousMine.map(([, v]) => v).find(Boolean);

      const currentLiked = mineCache
        ? getIds(mineCache).includes(String(vehicleId))
        : countState.liked;

      writeEverywhere(vehicleId, {
        liked: !currentLiked,
        likesCount: Math.max(
          0,
          countState.likesCount + (currentLiked ? -1 : 1)
        ),
      });

      return { previousStatus, previousBulk, previousMine, vehicleId };
    },

    onSuccess: (data, { vehicleId }) => {
      if (typeof data?.data?.liked === 'boolean') {
        writeEverywhere(vehicleId, data.data);
      }
      options?.onSuccess?.(data);
    },

    onError: (error, _vars, context) => {
      if (context) {
        [
          ...context.previousStatus,
          ...context.previousBulk,
          ...context.previousMine,
        ].forEach(([key, value]) => queryClient.setQueryData(key, value));
      }
      options?.onError?.(error);
    },

    onSettled: (_d, _e, { vehicleId }) => {
      queryClient.invalidateQueries({
        queryKey: ['likes', 'status', vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ['likes', 'bulk'] });
      queryClient.invalidateQueries({ queryKey: ['likes', 'mine'] });
    },
  });
};

export default useToggleLike;
