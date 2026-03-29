import { useState } from "react";
import VehicleFilter from "./components/VehicleFIlter";
import FilterPanel from "./components/FilterPanel";
import CarCard from "./components/CarCard";
import { motion } from "framer-motion";

const Vehicle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-18 min-h-screen">
      {/* Top Filter Bar */}
      <VehicleFilter
        onOpen={() => setIsOpen(true)}
        selectedFilters={filters}
        onRemove={(f) => setFilters(filters.filter((x) => x !== f))}
      />

      {/* Sidebar / Modal Filter Panel */}
      <FilterPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApply={(selected) => setFilters(selected)}
      />

      {/* Car Listings */}
      <div className="w-full flex flex-col justify-center items-center mt-2 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <CarCard key={i} />
        ))}
      </div>
    </motion.div>
  );
};

export default Vehicle;
