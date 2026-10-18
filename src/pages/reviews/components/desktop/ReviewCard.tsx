type ReviewItem = {
  name: string;
  role: string;
  text: string;
  image?: string;
  imageCount?: number;
  avatar: string;
  rating: number;
  date: string;
  type: 'photo' | 'text';
};

const STAR_PATH =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

const STAR_SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

export const StarRating = ({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: keyof typeof STAR_SIZES;
}) => (
  <div
    className="flex gap-0.5"
    role="img"
    aria-label={`${rating} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`${STAR_SIZES[size]} ${
          s <= rating ? 'text-amber-400' : 'text-gray-200'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
    ))}
  </div>
);

const VerifiedBadge = ({ onImage = false }: { onImage?: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
      onImage
        ? 'bg-white/95 text-emerald-700 shadow-sm backdrop-blur'
        : 'bg-emerald-50 text-emerald-700'
    }`}
  >
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
    Verified purchase
  </span>
);

const Reviewer = ({ item }: { item: ReviewItem }) => (
  <div className="flex min-w-0 items-center gap-3">
    <img
      src={item.avatar}
      alt=""
      className="h-10 w-10 flex-shrink-0 rounded-full border border-gray-200 object-cover"
    />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900">
        {item.name}
      </p>
      <p className="text-xs text-gray-400">{item.date}</p>
    </div>
  </div>
);

const PhotoCard = ({ item }: { item: ReviewItem }) => (
  <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
      <img
        src={item.image || ''}
        alt={`Photo shared by ${item.name}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute top-3 left-3">
        <VerifiedBadge onImage />
      </div>
      {(item.imageCount ?? 1) > 1 && (
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5v-15A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z"
            />
          </svg>
          {item.imageCount} photos
        </div>
      )}
    </div>

    <div className="p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <StarRating rating={item.rating} />
        <span className="text-xs font-medium text-gray-400">
          {item.rating}.0 / 5
        </span>
      </div>
      <p className="mb-4 text-[15px] leading-relaxed text-gray-700">
        {item.text}
      </p>
      <div className="border-t border-gray-100 pt-4">
        <Reviewer item={item} />
      </div>
    </div>
  </article>
);

const TextCard = ({ item }: { item: ReviewItem }) => (
  <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
    <div className="mb-4 flex items-start justify-between gap-3">
      <Reviewer item={item} />
      <StarRating rating={item.rating} />
    </div>
    <p className="mb-4 text-[15px] leading-relaxed text-gray-700">
      {item.text}
    </p>
    <VerifiedBadge />
  </article>
);

const ReviewCard = ({ item }: { item: ReviewItem }) =>
  item.type === 'photo' ? <PhotoCard item={item} /> : <TextCard item={item} />;

export type { ReviewItem };
export default ReviewCard;
