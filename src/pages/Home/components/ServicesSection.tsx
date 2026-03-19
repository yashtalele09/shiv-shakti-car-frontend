import { services } from "../constants";
import { motion } from "framer-motion";
const ServicesSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-102 flex flex-col bg-pink-100 mt-2 gap-3 shadow-[0_6px_10px_rgba(0,0,0,0.2)] p-4">
      <div className="flex items-center w-full h-[30%] justify-between">
        <div className="w-[50%]">
          <p className="text-xs font-inter text-gray-600 text-justify">
            These are the services we offer to our customers, These are the
            services we offer to our customers
          </p>
        </div>
        <div className="w-[45%] flex items-center justify-center">
          <img src={services[0]} alt="service1" className="h-40 " />
        </div>
      </div>
      <div className="flex items-center w-full h-[30%] justify-between">
        <div className="w-[45%] flex items-center justify-center">
          <img src={services[1]} alt="service2" className="h-40 " />
        </div>
        <div className="w-[50%]">
          <p className="text-xs font-inter text-gray-600 text-justify">
            These are the services we offer to our customers, These are the
            services we offer to our customers,
          </p>
        </div>
      </div>
      <div className="flex items-center w-full h-[30%] justify-between">
        <div className="w-[50%]">
          <p className="text-xs font-inter text-gray-600 text-justify">
            These are the services we offer to our customers, These are the
            services we offer to our customers,
          </p>
        </div>
        <div className="w-[45%] flex items-center justify-center">
          <img src={services[2]} alt="" className="h-40" />
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesSection;
