import { authInstance, instance } from '../../axios';
import type { GetReviewsResponse } from '../../typs/reviews/get';
import type { AddReviewApiResponse } from '../../typs/reviews/post';

const reviewService = {
  addReview: async (data: FormData): Promise<AddReviewApiResponse> => {
    const response = await authInstance.post('/reviews/add-review', data);
    return response.data;
  },

  getReviews: async (): Promise<GetReviewsResponse> => {
    const response = await instance.get('/reviews/get-reviews');
    return response.data;
  },
};
export default reviewService;
