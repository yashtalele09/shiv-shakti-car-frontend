export type AddReviewInput = FormData;
// Review Object Returned from API
export interface ReviewResponse {
  reviewId: string;
  userId: string;
  review: string;
  rating: number;
  images: string[];
  createdAt: string;
}

// Complete API Response
export interface AddReviewApiResponse {
  success: boolean;
  message: string;
  review: ReviewResponse;
}
