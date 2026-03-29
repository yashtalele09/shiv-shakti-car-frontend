import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-60 bg-gradient-to-b from-[#FFA1A1] to-[#AD93DE] flex items-center">
      <div className="px-6 md:px-12">
        <p className="text-white text-4xl md:text-5xl font-bold drop-shadow-md">
          Contact Us
        </p>

        <p className="text-white text-md md:text-lg mt-4 max-w-xl leading-relaxed drop-shadow-sm">
          Need help finding the{" "}
          <span className="font-semibold text-white/90">perfect vehicle</span>?
          Contact us today and our team will guide you.
        </p>
      </div>
    </motion.div>
  );
};

export default Header;
