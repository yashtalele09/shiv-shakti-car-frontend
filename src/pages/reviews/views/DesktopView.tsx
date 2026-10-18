import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReviewCard, { StarRating } from '../components/desktop/ReviewCard';
import type { ReviewItem } from '../components/desktop/ReviewCard';
import WriteReviewModal from '../components/desktop/WeiteAModel';
import NoReviews from '../components/desktop/NoReview';
import useGetReviewsMutation from '../hooks/useGetReviews';
import type { GetReviewsResponse, Review } from '../../../typs/reviews/get';
import useAuthStore from '../../../store/authStore';
import { showToast } from '../../../utils/toast';

const PAGE_SIZE = 8;

type SortKey = 'newest' | 'highest' | 'lowest';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'highest', label: 'Highest rated' },
  { value: 'lowest', label: 'Lowest rated' },
];

const mapToReviewItem = (r: Review): ReviewItem => {
  const hasImages = !!r.images && r.images.length > 0;
  return {
    name: r.userId.name,
    role: 'Verified Buyer',
    text: r.review,
    image: hasImages ? r.images[0] : undefined,
    imageCount: hasImages ? r.images.length : 0,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userId.name)}&background=F3F4F6&color=1F2937&bold=true`,
    rating: r.rating,
    date: new Date(r.createdAt).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    }),
    type: hasImages ? 'photo' : 'text',
  };
};

const ReviewsDesktop = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [barsAnimated, setBarsAnimated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewData, setReviewData] = useState<GetReviewsResponse | null>(null);

  // View state (client-side filtering / sorting)
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [photosOnly, setPhotosOnly] = useState(false);
  const [sortValue, setSortValue] = useState<SortKey>('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { mutate: fetchReviews, isPending } = useGetReviewsMutation({
    onSuccess: (data: GetReviewsResponse) => {
      setReviewData(data);
      setTimeout(() => setBarsAnimated(true), 300);
    },
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const data = reviewData?.data;
  const overall = data?.overallRating ?? 0;
  const total = data?.totalReviews ?? 0;
  const filledStars = Math.round(overall);
  const hasReviews = (data?.reviews?.length ?? 0) > 0;

  const ratingDist = useMemo(
    () =>
      data
        ? [5, 4, 3, 2, 1].map((stars) => {
            const count =
              data.ratingCount?.[
                stars.toString() as keyof typeof data.ratingCount
              ] ?? 0;
            const pct =
              data.totalReviews > 0
                ? Math.round((count / data.totalReviews) * 100)
                : 0;
            return { stars, count, pct };
          })
        : [],
    [data]
  );

  const visibleReviews = useMemo(() => {
    let list = [...(data?.reviews ?? [])];
    if (starFilter) list = list.filter((r) => r.rating === starFilter);
    if (photosOnly) list = list.filter((r) => r.images && r.images.length > 0);

    list.sort((a, b) => {
      if (sortValue === 'highest') return b.rating - a.rating;
      if (sortValue === 'lowest') return a.rating - b.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [data, starFilter, photosOnly, sortValue]);

  const hasActiveFilters = starFilter !== null || photosOnly;

  const clearFilters = () => {
    setStarFilter(null);
    setPhotosOnly(false);
    setVisibleCount(PAGE_SIZE);
  };

  const handleStarFilter = (stars: number) => {
    setStarFilter((prev) => (prev === stars ? null : stars));
    setVisibleCount(PAGE_SIZE);
  };

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      showToast.error('Please login to write a review');
      navigate('/sign-in', { state: { from: '/reviews' } });
      return;
    }
    setShowModal(true);
  };

  const WriteButton = ({ full = false }: { full?: boolean }) => (
    <button
      onClick={handleWriteReviewClick}
      className={`flex items-center justify-center gap-2 rounded-full bg-[#1B2F4B] px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-[#1B2F4B]/20 transition-all hover:bg-[#2A4468] focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97] ${
        full ? 'w-full' : ''
      }`}
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
  );

  const chipBase =
    'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:outline-none';
  const chipOn = 'border-[#1B2F4B] bg-[#1B2F4B] text-white';
  const chipOff =
    'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50';

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-15 min-h-screen w-full max-w-[1440px] px-8 pt-24 pb-12"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Page header */}
        <header className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
              What our buyers say
            </h1>
            <p className="text-sm text-gray-500">
              Every review comes from a verified purchase.
            </p>
          </div>
          {hasReviews && !isPending && <WriteButton />}
        </header>

        {/* Empty state: no sidebar, full width */}
        {!isPending && !hasReviews ? (
          <NoReviews onWrite={handleWriteReviewClick} />
        ) : (
          <div className="flex gap-6">
            {/* ── Sidebar ── */}
            <aside className="sticky top-28 flex h-fit w-80 flex-shrink-0 flex-col gap-4">
              {/* Overall rating */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                {isPending ? (
                  <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
                ) : (
                  <div className="flex items-center gap-5">
                    <div className="text-5xl leading-none font-bold text-gray-900">
                      {overall.toFixed(1)}
                    </div>
                    <div>
                      <StarRating rating={filledStars} size="lg" />
                      <p className="mt-1.5 text-sm text-gray-500">
                        Based on{' '}
                        <span className="font-semibold text-gray-900">
                          {total}
                        </span>{' '}
                        verified {total === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Breakdown — each row filters the list */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    Rating breakdown
                  </p>
                  {starFilter && (
                    <button
                      onClick={() => setStarFilter(null)}
                      className="text-xs font-medium text-[#FF7272] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {isPending
                    ? [5, 4, 3, 2, 1].map((s) => (
                        <div
                          key={s}
                          className="flex items-center gap-3 px-2 py-1.5"
                        >
                          <span className="w-3 text-right text-xs text-gray-400">
                            {s}
                          </span>
                          <div className="h-2 flex-1 rounded-full bg-gray-100" />
                        </div>
                      ))
                    : ratingDist.map(({ stars, count, pct }) => {
                        const active = starFilter === stars;
                        return (
                          <button
                            key={stars}
                            onClick={() => handleStarFilter(stars)}
                            aria-pressed={active}
                            title={`${count} ${count === 1 ? 'review' : 'reviews'}`}
                            disabled={count === 0}
                            className={`flex items-center gap-3 rounded-lg px-2 py-1.5 transition focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:outline-none disabled:cursor-default disabled:opacity-50 ${
                              active ? 'bg-[#1B2F4B]/5' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex w-6 flex-shrink-0 items-center justify-end gap-0.5 text-xs font-medium text-gray-600">
                              {stars}
                              <svg
                                className="h-3 w-3 text-amber-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-[#1B2F4B] transition-all duration-1000 ease-out"
                                style={{
                                  width: barsAnimated ? `${pct}%` : '0%',
                                }}
                              />
                            </div>
                            <span className="w-9 text-right text-xs text-gray-400">
                              {pct}%
                            </span>
                          </button>
                        );
                      })}
                </div>
              </div>

              {/* CTA */}
              {!isPending && (
                <div className="rounded-2xl border border-[#1B2F4B]/10 bg-[#1B2F4B]/5 p-6">
                  <p className="mb-1 text-sm font-semibold text-gray-900">
                    Bought from us?
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">
                    Add your review and help the next buyer decide.
                  </p>
                  <WriteButton full />
                </div>
              )}
            </aside>

            {/* ── Main ── */}
            <main className="flex min-w-0 flex-1 flex-col gap-5">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3.5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={clearFilters}
                    className={`${chipBase} ${!hasActiveFilters ? chipOn : chipOff}`}
                  >
                    All reviews
                  </button>
                  <button
                    onClick={() => {
                      setPhotosOnly((p) => !p);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    aria-pressed={photosOnly}
                    className={`${chipBase} ${photosOnly ? chipOn : chipOff}`}
                  >
                    With photos
                  </button>
                  {starFilter && (
                    <button
                      onClick={() => setStarFilter(null)}
                      className={`${chipBase} ${chipOn} flex items-center gap-1.5`}
                    >
                      {starFilter} stars
                      <span aria-hidden="true">✕</span>
                      <span className="sr-only">Remove star filter</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {isPending ? (
                      'Loading…'
                    ) : (
                      <>
                        <span className="font-semibold text-gray-900">
                          {visibleReviews.length}
                        </span>{' '}
                        {visibleReviews.length === 1 ? 'review' : 'reviews'}
                      </>
                    )}
                  </span>
                  <label className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="sr-only">Sort by</span>
                    <select
                      value={sortValue}
                      onChange={(e) => setSortValue(e.target.value as SortKey)}
                      className="cursor-pointer rounded-full border border-gray-200 bg-white py-2 pr-8 pl-4 text-sm font-medium text-gray-700 outline-none focus:border-[#1B2F4B] focus:ring-4 focus:ring-[#1B2F4B]/15"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {/* Reviews */}
              {isPending ? (
                <div className="columns-2 gap-5">
                  {[160, 260, 200, 300, 180, 240].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: h }}
                      className="mb-5 animate-pulse break-inside-avoid rounded-2xl bg-gray-100"
                    />
                  ))}
                </div>
              ) : visibleReviews.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
                  <p className="mb-1 text-base font-semibold text-gray-900">
                    No reviews match these filters
                  </p>
                  <p className="mb-5 text-sm text-gray-500">
                    Try a different rating or remove the photo filter.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-[#FF7272] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Masonry: photo cards and text cards have different heights */}
                  <div className="columns-1 gap-5 xl:columns-2">
                    {visibleReviews.slice(0, visibleCount).map((item, i) => (
                      <div
                        key={`${item.createdAt}-${i}`}
                        className="mb-5 break-inside-avoid"
                      >
                        <ReviewCard item={mapToReviewItem(item)} />
                      </div>
                    ))}
                  </div>

                  {visibleCount < visibleReviews.length && (
                    <button
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="mx-auto rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#1B2F4B]/40 focus-visible:outline-none"
                    >
                      Show more reviews
                    </button>
                  )}
                </>
              )}
            </main>
          </div>
        )}
      </motion.div>

      {showModal && isAuthenticated && (
        <WriteReviewModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ReviewsDesktop;
