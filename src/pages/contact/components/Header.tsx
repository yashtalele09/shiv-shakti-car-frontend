import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-60 w-full items-center bg-gradient-to-b from-[#FFA1A1] to-[#AD93DE]"
    >
      <div className="px-6 md:px-12">
        <p className="text-4xl font-bold text-white drop-shadow-md md:text-5xl">
          Contact Us
        </p>

        <p className="text-md mt-4 max-w-xl leading-relaxed text-white drop-shadow-sm md:text-lg">
          Need help finding the{' '}
          <span className="font-semibold text-white/90">perfect vehicle</span>?
          Contact us today and our team will guide you.
        </p>
      </div>
    </motion.div>
  );
};

export default Header;
