import { brands } from '../../constants';
import { motion } from 'framer-motion';

/**
 * Shares the token system from ServicesSection:
 *   Ink   #1D1420   Rose  #C1275A   Paper #FBF5F3   Mute  #8B7680   Hairline #E7D3D9
 *   font-display: Fraunces   font-body: Inter   font-mono: IBM Plex Mono
 */

const stats = [
  { value: '29', suffix: '+', label: 'Years in Business' },
  { value: '1,000', suffix: '+', label: 'Cars Sold' },
  { value: '10,000', suffix: '+', label: 'Happy Customers' },
];

const BeltCarousel = () => {
  const row1 = [...brands, ...brands, ...brands];
  const row2 = [...brands, ...brands, ...brands].reverse();

  return (
    <section className="w-[85%] overflow-hidden bg-gradient-to-b from-[#f2f7ff] via-[#e0edf6] to-[#f2f7ff] py-16 lg:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto mb-14 max-w-2xl px-6 text-center lg:mb-20"
      >
        <span className="font-mono text-[11px] font-medium tracking-[0.22em] text-[#C1275A] uppercase">
          Trusted by the industry
        </span>
        <h2 className="font-display mt-4 text-3xl leading-tight font-medium text-[#1D1420] lg:text-[2.75rem]">
          Shiv Shakti Car Bazar
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#8B7680] lg:text-[15px]">
          Three decades of buying and selling with every major car brand on the
          road today.
        </p>
      </motion.div>

      {/* Logo marquee */}
      <div className="flex flex-col gap-4">
        {/* Row 1 */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-[#FBF5F3] to-transparent lg:w-32" />
          <div className="absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-[#FBF5F3] to-transparent lg:w-32" />

          <div className="animate-scrollLeft flex w-max gap-4 hover:[animation-play-state:paused] lg:gap-5">
            {row1.map((brand, i) => (
              <div
                key={i}
                aria-hidden={i >= brands.length}
                className="group flex h-[64px] w-[124px] shrink-0 items-center justify-center rounded-xl border border-[#E7D3D9] bg-white transition-all duration-300 lg:h-[76px] lg:w-[150px]"
              >
                <img
                  src={brand.logo}
                  alt={i < brands.length ? brand.name : ''}
                  className="h-7 object-contain grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0 lg:h-8"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-[#FBF5F3] to-transparent lg:w-32" />
          <div className="absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-[#FBF5F3] to-transparent lg:w-32" />

          <div className="animate-scrollRight flex w-max gap-4 hover:[animation-play-state:paused] lg:gap-5">
            {row2.map((brand, i) => (
              <div
                key={i}
                aria-hidden={i >= brands.length}
                className="group flex h-[64px] w-[124px] shrink-0 items-center justify-center rounded-xl border border-[#E7D3D9] bg-white transition-all duration-300 lg:h-[76px] lg:w-[150px]"
              >
                <img
                  src={brand.logo}
                  alt={i < brands.length ? brand.name : ''}
                  className="h-7 object-contain grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0 lg:h-8"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats — credibility ledger */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="mx-auto mt-14 max-w-4xl px-6 lg:mt-20"
      >
        <div className="grid grid-cols-1 divide-y divide-[#E7D3D9] rounded-2xl border border-[#E7D3D9] bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 px-6 py-8 text-center lg:py-10"
            >
              <p className="font-display text-3xl font-medium text-[#1D1420] lg:text-4xl">
                {stat.value}
                <span className="text-[#C1275A]">{stat.suffix}</span>
              </p>
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#8B7680] uppercase lg:text-[11px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Animations */}
      <style>
        {`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }

          @keyframes scrollRight {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }

          .animate-scrollLeft {
            animation: scrollLeft 35s linear infinite;
          }

          .animate-scrollRight {
            animation: scrollRight 35s linear infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-scrollLeft,
            .animate-scrollRight {
              animation: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default BeltCarousel;
