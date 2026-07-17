import { useMutation, useQueryClient } from '@tanstack/react-query';
import reviewService from '../../../lib/services/review-service';

type UseGetReviewsMutationOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

const useGetReviewsMutation = (options?: UseGetReviewsMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reviewService.getReviews(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export default useGetReviewsMutation;
