import { useState } from 'react';
import { services } from '../../constants';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * Fonts required (add once, e.g. in index.html <head> or via next/font):
 *   Fraunces        — display serif, headlines
 *   Inter           — body / UI
 *   IBM Plex Mono   — tags / eyebrows
 *
 * <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet" />
 *
 * Tailwind config (extend.fontFamily):
 *   display: ['Fraunces', 'serif']
 *   body:    ['Inter', 'sans-serif']
 *   mono:    ['"IBM Plex Mono"', 'monospace']
 */

const serviceData = [
  {
    label: 'Design',
    tag: 'Identity & Interface',
    description:
      'We craft tailored solutions that address your core business needs with precision, creativity, and a commitment to excellence.',
    image: services[0],
    alt: 'Design service',
  },
  {
    label: 'Strategy',
    tag: 'Direction & Growth',
    description:
      'Our expert team partners with you at every stage, ensuring quality outcomes that drive lasting growth and competitive advantage.',
    image: services[1],
    alt: 'Strategy service',
  },
  {
    label: 'Delivery',
    tag: 'Build & Launch',
    description:
      'From concept to completion, we deliver seamlessly — on time, on budget, and beyond expectations every single time.',
    image: services[2],
    alt: 'Delivery service',
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const ServicesSection = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  return (
    <section className="font-body flex w-full flex-col items-center bg-transparent text-[#1D1420]">
      {/* Desktop: sticky image + interactive list */}
      <div className="mx-auto hidden max-w-6xl px-10 pt-10 pb-24 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Sticky image panel */}
        <div className="sticky top-24 h-[560px] self-start overflow-hidden rounded-[1.75rem] bg-[#1D1420]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img
                src={serviceData[active].image}
                alt={serviceData[active].alt}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1420] via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-8">
            <div>
              <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-[#F3DFE6] uppercase">
                {serviceData[active].tag}
              </span>
              <p className="font-display mt-1 text-2xl font-medium text-white">
                {serviceData[active].label}
              </p>
            </div>
            <span className="font-mono text-xs text-white/50">
              0{active + 1} / 0{serviceData.length}
            </span>
          </div>
        </div>

        {/* Interactive list */}
        <div className="relative flex flex-col">
          {serviceData.map((service, i) => {
            const isActive = i === active;
            return (
              <button
                key={service.label}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group relative flex items-start gap-6 border-t border-[#E7D3D9] py-8 text-left transition-colors last:border-b focus:outline-none ${
                  isActive ? '' : 'opacity-60 hover:opacity-90'
                }`}
              >
                {/* active rail marker */}
                <span
                  className={`mt-2 h-8 w-[3px] shrink-0 rounded-full transition-colors ${
                    isActive ? 'bg-[#C1275A]' : 'bg-transparent'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-[#C1275A] uppercase">
                      {service.tag}
                    </span>
                  </div>
                  <p className="font-display mt-2 text-3xl font-medium text-[#1D1420]">
                    {service.label}
                  </p>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="max-w-md overflow-hidden text-[15px] leading-relaxed text-[#8B7680]"
                      >
                        {service.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <span
                  className={`font-display mt-3 text-2xl text-[#C1275A] transition-transform ${
                    isActive
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-1 opacity-0'
                  }`}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="flex flex-col gap-4 px-5 pt-6 pb-12 lg:hidden"
      >
        {serviceData.map((service) => (
          <motion.div
            key={service.label}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_rgba(29,20,32,0.06)]"
          >
            <div className="relative aspect-[16/10] w-full">
              <img
                src={service.image}
                alt={service.alt}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1420]/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 font-mono text-[10px] font-medium tracking-[0.16em] text-[#F3DFE6] uppercase">
                {service.tag}
              </span>
            </div>
            <div className="px-5 py-5">
              <p className="font-display text-xl font-medium text-[#1D1420]">
                {service.label}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8B7680]">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer CTA — inverted to bookend the section */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="w-full bg-[#1D1420] px-6 py-14 lg:w-[85%] lg:px-10 lg:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <p className="font-display max-w-md text-2xl leading-snug font-medium text-white lg:text-3xl">
            Ready to start something worth designing for?
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="group flex shrink-0 items-center gap-2 rounded-full bg-[#C1275A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(193,39,90,0.35)] transition-all hover:bg-[#a81f4d] active:scale-95"
          >
            Contact us
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
