import { useMutation, useQueryClient } from '@tanstack/react-query';
import likeService from '../lib/services/like-service';
import type {
  GetBulkLikesResponseT,
  ToggleLikeInputT,
  ToggleLikeResponseT,
} from '../typs/like/like';

type UseToggleLikeMutationOptions = {
  onSuccess?: (data: ToggleLikeResponseT) => void;
  onError?: (error: any) => void;
};

const useToggleLike = (options?: UseToggleLikeMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ToggleLikeInputT) => likeService.toggleLike(body),

    // Instant UI update before the server responds
    onMutate: async ({ vehicleId }) => {
      await queryClient.cancelQueries({ queryKey: ['likes'] });

      const previousStatus = queryClient.getQueryData<ToggleLikeResponseT>([
        'likes',
        'status',
        vehicleId,
      ]);
      const previousBulk = queryClient.getQueriesData<GetBulkLikesResponseT>({
        queryKey: ['likes', 'bulk'],
      });

      const flip = (state?: { liked: boolean; likesCount: number }) => {
        if (!state) return state;
        return {
          liked: !state.liked,
          likesCount: Math.max(0, state.likesCount + (state.liked ? -1 : 1)),
        };
      };

      queryClient.setQueryData<ToggleLikeResponseT>(
        ['likes', 'status', vehicleId],
        (old) => (old?.data ? { ...old, data: flip(old.data)! } : old)
      );

      queryClient.setQueriesData<GetBulkLikesResponseT>(
        { queryKey: ['likes', 'bulk'] },
        (old) => {
          if (!old?.data?.[vehicleId]) return old;
          return {
            ...old,
            data: { ...old.data, [vehicleId]: flip(old.data[vehicleId])! },
          };
        }
      );

      return { previousStatus, previousBulk, vehicleId };
    },

    // Replace the optimistic value with the real server value
    onSuccess: (data: ToggleLikeResponseT, { vehicleId }) => {
      queryClient.setQueryData(['likes', 'status', vehicleId], data);

      queryClient.setQueriesData<GetBulkLikesResponseT>(
        { queryKey: ['likes', 'bulk'] },
        (old) => {
          if (!old?.data?.[vehicleId]) return old;
          return { ...old, data: { ...old.data, [vehicleId]: data.data } };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['likes', 'mine'] });
      options?.onSuccess?.(data);
    },

    // Roll back on failure
    onError: (error, _vars, context) => {
      if (context) {
        queryClient.setQueryData(
          ['likes', 'status', context.vehicleId],
          context.previousStatus
        );
        context.previousBulk.forEach(([key, value]) =>
          queryClient.setQueryData(key, value)
        );
      }
      options?.onError?.(error);
    },
  });
};

export default useToggleLike;
