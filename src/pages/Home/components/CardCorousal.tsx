import CarCard from "./CarCard";
import { motion } from "framer-motion";

const CardCorousal = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-2 mt-1 h-75 bg-pink-100 rounded-xl flex items-center overflow-x-auto gap-2">
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
    </motion.div>
  );
};

export default CardCorousal;
