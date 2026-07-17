export interface ReviewUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  userId: ReviewUser;
  review: string;
  rating: number;
  images: string[];
  reviewId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RatingCount {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface ReviewsData {
  overallRating: number;
  totalReviews: number;
  ratingCount: RatingCount;
  reviews: Review[];
}

export interface GetReviewsResponse {
  success: boolean;
  data: ReviewsData;
}
