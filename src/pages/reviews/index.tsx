import { useState, useEffect } from 'react';
import ReviewCard from './components/ReviewCard';
import type { ReviewItem } from './components/ReviewCard';
import WriteReviewModal from './components/WriteAModel';
import useGetReviewsMutation from './hooks/useGetReviews';
import type { GetReviewsResponse, Review } from '../../typs/reviews/get';
import NoReviews from './components/NoReviews';

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`h-3 w-3 ${filled ? 'text-amber-400' : 'text-gray-200'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ReviewsPage = () => {
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewData, setReviewData] = useState<GetReviewsResponse | null>(null);

  const { mutate: fetchReviews, isPending } = useGetReviewsMutation({
    onSuccess: (data: GetReviewsResponse) => {
      setReviewData(data);
      console.log('API Success:', data);
      setTimeout(() => setBarsAnimated(true), 300);
    },
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const ratingDist = reviewData?.data
    ? [5, 4, 3, 2, 1].map((stars) => {
        const count =
          reviewData.data.ratingCount?.[
            stars.toString() as keyof typeof reviewData.data.ratingCount
          ] ?? 0;
        const pct =
          reviewData.data.totalReviews > 0
            ? Math.round((count / reviewData.data.totalReviews) * 100)
            : 0;
        return { stars, pct };
      })
    : [];

  const filledStars = Math.round(reviewData?.data?.overallRating ?? 0);
  const hasReviews = (reviewData?.data?.reviews?.length ?? 0) > 0;

  const mapToReviewItem = (r: Review): ReviewItem => {
    const hasImages = r.images && r.images.length > 0;
    return {
      name: r.userId.name,
      role: 'Verified Buyer',
      text: r.review,
      image: hasImages ? r.images[0] : undefined,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userId.name)}&background=F3F4F6&color=1F2937&bold=true`,
      rating: r.rating,
      date: new Date(r.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      }),
      type: hasImages ? 'photo' : 'text',
    };
  };

  return (
    <>
      <section className="mt-15 min-h-screen w-full bg-gray-50 px-4 pb-28">
        {/* Page Header */}
        <div className="mb-6 pt-6">
          <p className="mb-1 font-sans text-[10px] font-semibold tracking-[0.15em] text-orange-500 uppercase">
            Verified customers
          </p>
          <h1 className="mb-1.5 font-sans text-[22px] leading-snug font-bold text-gray-900">
            What our buyers say
          </h1>
          <p className="font-sans text-xs leading-relaxed text-gray-400">
            All reviews are from verified purchase customers only.
          </p>
        </div>

        {/* Stats Row — hidden when no reviews */}
        {(isPending || hasReviews) && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-1 font-sans text-2xl font-bold text-gray-900">
                {isPending ? '—' : (reviewData?.data?.overallRating ?? '—')}
              </div>
              <div className="mb-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled={s <= filledStars} />
                ))}
              </div>
              <div className="font-sans text-[10px] tracking-wide text-gray-400 uppercase">
                Overall rating
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-1 font-sans text-2xl font-bold text-gray-900">
                {isPending ? '—' : (reviewData?.data?.totalReviews ?? '—')}
              </div>
              <div className="mt-5 font-sans text-[10px] tracking-wide text-gray-400 uppercase">
                Verified reviews
              </div>
            </div>
          </div>
        )}

        {/* Rating Distribution — hidden when no reviews */}
        {(isPending || hasReviews) && (
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-3 font-sans text-[11px] tracking-widest text-gray-400 uppercase">
              Rating breakdown
            </p>
            <div className="flex flex-col gap-2">
              {isPending
                ? [5, 4, 3, 2, 1].map((s) => (
                    <div key={s} className="flex items-center gap-2.5">
                      <span className="w-3 text-right font-sans text-[11px] text-gray-400">
                        {s}
                      </span>
                      <div className="h-1.5 flex-1 rounded-full bg-gray-100" />
                    </div>
                  ))
                : ratingDist.map(({ stars, pct }) => (
                    <div key={stars} className="flex items-center gap-2.5">
                      <span className="w-3 text-right font-sans text-[11px] text-gray-400">
                        {stars}
                      </span>
                      <svg
                        className="h-2.5 w-2.5 flex-shrink-0 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all duration-1000 ease-out"
                          style={{ width: barsAnimated ? `${pct}%` : '0%' }}
                        />
                      </div>
                      <span className="w-7 text-right font-sans text-[11px] text-gray-400">
                        {pct}%
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Section Header — hidden when no reviews */}
        {(isPending || hasReviews) && (
          <div className="mb-3 flex items-center justify-between">
            <p className="font-sans text-sm font-semibold text-gray-900">
              Recent reviews
            </p>
          </div>
        )}

        {/* Review Cards */}
        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : !hasReviews ? (
          <NoReviews onWrite={() => setShowModal(true)} />
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {reviewData!.data.reviews.map((item, i) => (
                <ReviewCard key={i} item={mapToReviewItem(item)} />
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl border border-gray-200 bg-white py-3 font-sans text-sm text-gray-500 shadow-sm transition-colors hover:bg-gray-50">
              Load more reviews
            </button>
          </>
        )}
      </section>

      {/* Floating Sticky FAB */}
      <div className="pointer-events-none fixed right-1 bottom-20 left-0 z-50 flex justify-end px-4">
        {hasReviews && !isPending && (
          <button
            onClick={() => setShowModal(true)}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 font-sans text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-400 active:scale-[0.97]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
              />
            </svg>
            Write a review
          </button>
        )}
      </div>

      {showModal && <WriteReviewModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ReviewsPage;
