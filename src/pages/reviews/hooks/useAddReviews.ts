import { useMutation, useQueryClient } from '@tanstack/react-query';
import reviewService from '../../../lib/services/review-service';
import type { AddReviewInput } from '@/typs/reviews/post';
import { showToast } from '../../../utils/toast';

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
      showToast.success('Review added successfully!');
    },
    onError: (error) => {
      options?.onError?.(error);
      showToast.error('Failed to add review!');
    },
  });
};

export default useAddReviewMutation;
