import CarCard from "./CarCard";

const cars = [
  {
    title: "2016 Maruti Suzuki Swift",
    price: "₹ 5.50 Lakh",
    fuel: "Petrol",
    transmission: "Manual",
    km: "10,000 KM",
    year: "2016",
  },
  {
    title: "2020 Honda City ZX",
    price: "₹ 9.20 Lakh",
    fuel: "Petrol",
    transmission: "CVT",
    km: "24,500 KM",
    year: "2020",
  },
  {
    title: "2019 Hyundai Creta SX",
    price: "₹ 11.80 Lakh",
    fuel: "Diesel",
    transmission: "Automatic",
    km: "38,000 KM",
    year: "2019",
  },
  {
    title: "2022 Tata Nexon EV",
    price: "₹ 14.50 Lakh",
    fuel: "Electric",
    transmission: "Automatic",
    km: "8,200 KM",
    year: "2022",
  },
  {
    title: "2021 Kia Seltos GTX",
    price: "₹ 13.40 Lakh",
    fuel: "Petrol",
    transmission: "DCT",
    km: "15,700 KM",
    year: "2021",
  },
];

const CardCarousel = () => {
  return (
    <div className="w-full py-3">
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none" }}>
        {cars.map((car, i) => (
          <CarCard key={i} {...car} />
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;
