type ReviewItem = {
  name: string;
  role: string;
  text: string;
  image?: string;
  avatar: string;
  rating: number;
  date: string;
  type: 'photo' | 'text';
};

const StarRating = ({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'sm' | 'xs';
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`${size === 'sm' ? 'h-3 w-3' : 'h-2.5 w-2.5'} ${
          s <= rating ? 'text-amber-400' : 'text-gray-200'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const CheckIcon = () => (
  <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const PhotoCard = ({ item }: { item: ReviewItem }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div className="relative h-52 w-full overflow-hidden">
      <img
        src={item.image || ''}
        alt={item.name}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
      <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 font-sans text-[10px] text-white">
        <CheckIcon />
        Verified
      </div>
      <div className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/25 px-2.5 py-1 font-sans text-[10px] tracking-wide text-white/80">
        {item.date}
      </div>
      <div className="absolute right-0 bottom-0 left-0 px-4 pt-6 pb-3">
        <p className="font-sans text-sm leading-none font-semibold text-white">
          {item.name}
        </p>
        <p className="mt-0.5 font-sans text-[10px] tracking-widest text-white/50 uppercase">
          {item.role}
        </p>
      </div>
    </div>

    <div className="px-4 pt-4 pb-4">
      <div className="mb-3 flex gap-2">
        <span
          className="mt-1 flex-shrink-0 text-3xl leading-none text-orange-400"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          "
        </span>
        <p
          className="text-sm leading-relaxed text-gray-600"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {item.text}"
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
            <img
              src={item.avatar}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-sans text-xs font-semibold text-gray-900">
            {item.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <StarRating rating={item.rating} />
          <span className="font-sans text-[11px] text-gray-400">
            {item.rating}.0
          </span>
        </div>
      </div>
    </div>
  </div>
);

const TextCard = ({ item }: { item: ReviewItem }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center gap-3">
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
        <img
          src={item.avatar}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-sans text-sm leading-none font-semibold text-gray-900">
          {item.name}
        </p>
        <div className="flex items-center gap-2">
          <StarRating rating={item.rating} size="xs" />
          <span className="font-sans text-[10px] tracking-wide text-gray-400 uppercase">
            {item.role}
          </span>
        </div>
      </div>
      <span className="flex-shrink-0 font-sans text-[10px] text-gray-400">
        {item.date}
      </span>
    </div>
    <div
      className="border-l-2 border-orange-500 pl-3 text-sm leading-relaxed text-gray-600"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      "{item.text}"
    </div>
    <div className="mt-3 flex items-center gap-1 font-sans text-[10px] text-orange-500">
      <CheckIcon />
      Verified purchase
    </div>
  </div>
);

const ReviewCard = ({ item }: { item: ReviewItem }) =>
  item.type === 'photo' ? <PhotoCard item={item} /> : <TextCard item={item} />;

export type { ReviewItem };
export default ReviewCard;
