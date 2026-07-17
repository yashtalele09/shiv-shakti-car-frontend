import { useMutation, useQueryClient } from '@tanstack/react-query';
import reviewService from '../../../lib/services/review-service';
import type { AddReviewInput } from '@/typs/reviews/post';

type UseAddReviewMutationOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

const useAddReviewMutation = (options?: UseAddReviewMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddReviewInput) => reviewService.addReview(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export default useAddReviewMutation;
