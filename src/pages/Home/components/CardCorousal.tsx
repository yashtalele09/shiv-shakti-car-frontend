import CarCard from "./CarCard";

const CardCorousal = () => {
  return (
    <div className="w-full px-2 mt-1 h-75 bg-pink-100 rounded-xl flex items-center overflow-x-auto gap-2">
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
    </div>
  );
};

export default CardCorousal;
