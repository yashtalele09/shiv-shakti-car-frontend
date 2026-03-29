import { services } from "../constants";
import { motion, type Variants } from "framer-motion";

const serviceData = [
  {
    label: "Service One",
    tag: "Design",
    description:
      "We craft tailored solutions that address your core business needs with precision, creativity, and a commitment to excellence.",
    image: services[0],
    alt: "service1",
    reverse: false,
  },
  {
    label: "Service Two",
    tag: "Strategy",
    description:
      "Our expert team partners with you at every stage, ensuring quality outcomes that drive lasting growth and competitive advantage.",
    image: services[1],
    alt: "service2",
    reverse: true,
  },
  {
    label: "Service Three",
    tag: "Delivery",
    description:
      "From concept to completion, we deliver seamlessly — on time, on budget, and beyond expectations every single time.",
    image: services[2],
    alt: "service3",
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
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const ServicesSection = () => {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="w-full bg-rose-50 mt-2 shadow-[0_8px_24px_rgba(0,0,0,0.10)] rounded-2xl overflow-hidden">
      {/* Service Rows */}
      <div className="flex flex-col divide-y divide-pink-100 px-4 pb-5 pt-3 gap-1">
        {serviceData.map((service, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`flex items-center justify-between py-5 gap-4 ${
              service.reverse ? "flex-row-reverse" : "flex-row"
            }`}>
            {/* Text */}
            <div className="flex-1 flex flex-col gap-2">
              <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full bg-pink-200/70 text-pink-700 text-[10px] font-semibold tracking-wide uppercase">
                {service.tag}
              </span>
              <p className="text-sm font-semibold text-gray-700 leading-tight">
                {service.label}
              </p>
              <p className="text-[11.5px] text-gray-500 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Image */}
            <div className="flex-shrink-0 w-[42%] flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[150px] rounded-2xl overflow-hidden bg-white shadow-[0_4px_14px_rgba(236,72,153,0.12)] border border-pink-100">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover"
                />
                {/* Subtle pink tint overlay */}
                <div className="absolute inset-0 bg-pink-400/5 pointer-events-none rounded-2xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div
        variants={itemVariants}
        className="mx-4 mb-5 flex items-center justify-between bg-pink-200/50 rounded-xl px-4 py-3 border border-pink-200">
        <p className="text-xs text-pink-700 font-medium">
          Ready to get started?
        </p>
        <button className="text-[11px] font-semibold bg-pink-500 hover:bg-pink-600 active:scale-95 transition-all text-white px-3.5 py-1.5 rounded-lg shadow-sm">
          Contact Us →
        </button>
      </motion.div>
    </motion.section>
  );
};

export default ServicesSection;
