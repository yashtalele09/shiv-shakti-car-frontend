import { services } from '../constants';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const serviceData = [
  {
    label: 'Service One',
    tag: 'Design',
    description:
      'We craft tailored solutions that address your core business needs with precision, creativity, and a commitment to excellence.',
    image: services[0],
    alt: 'service1',
    reverse: false,
  },
  {
    label: 'Service Two',
    tag: 'Strategy',
    description:
      'Our expert team partners with you at every stage, ensuring quality outcomes that drive lasting growth and competitive advantage.',
    image: services[1],
    alt: 'service2',
    reverse: true,
  },
  {
    label: 'Service Three',
    tag: 'Delivery',
    description:
      'From concept to completion, we deliver seamlessly — on time, on budget, and beyond expectations every single time.',
    image: services[2],
    alt: 'service3',
    reverse: false,
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const ServicesSection = () => {
  const navigate = useNavigate();
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="mt-2 w-full overflow-hidden rounded-2xl bg-rose-50 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
    >
      {/* Service Rows */}
      <div className="flex flex-col gap-1 divide-y divide-pink-100 px-4 pt-3 pb-5">
        {serviceData.map((service, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`flex items-center justify-between gap-4 py-5 ${
              service.reverse ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Text */}
            <div className="flex flex-1 flex-col gap-2">
              <span className="inline-flex items-center self-start rounded-full bg-pink-200/70 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-pink-700 uppercase">
                {service.tag}
              </span>
              <p className="text-sm leading-tight font-semibold text-gray-700">
                {service.label}
              </p>
              <p className="text-[11.5px] leading-relaxed text-gray-500">
                {service.description}
              </p>
            </div>

            {/* Image */}
            <div className="flex w-[42%] flex-shrink-0 items-center justify-center">
              <div className="relative aspect-square w-full max-w-[150px] overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-[0_4px_14px_rgba(236,72,153,0.12)]">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="h-full w-full object-cover"
                />
                {/* Subtle pink tint overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-pink-400/5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div
        variants={itemVariants}
        className="mx-4 mb-5 flex items-center justify-between rounded-xl border border-pink-200 bg-pink-200/50 px-4 py-3"
      >
        <p className="text-xs font-medium text-pink-700">
          Ready to get started?
        </p>
        <button
          onClick={() => navigate('/contact')}
          className="rounded-lg bg-pink-500 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-pink-600 active:scale-95"
        >
          Contact Us →
        </button>
      </motion.div>
    </motion.section>
  );
};

export default ServicesSection;
