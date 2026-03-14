import Bg1 from "../../../assets/banner.png";

import sedanIcon from "../../../assets/sedan.png";
import suvIcon from "../../../assets/suv.png";
import hatchbackIcon from "../../../assets/hatchback.png";
import commercialIcon from "../../../assets/comercial.png";

//car brand logos
import suzuki from "../../../assets/brands/suzuki.svg";
import tata from "../../../assets/brands/tata.svg";
import mahindra from "../../../assets/brands/mahindra.svg";
import toyota from "../../../assets/brands/toyota.svg";
import honda from "../../../assets/brands/honda.svg";
import hyundai from "../../../assets/brands/hyundai.svg";
import kia from "../../../assets/brands/kia.svg";
import renault from "../../../assets/brands/renault.svg";
import skoda from "../../../assets/brands/skoda.svg";
import volkswagen from "../../../assets/brands/volkswagen.svg";
import mg from "../../../assets/brands/mg.svg";
import nissan from "../../../assets/brands/nissan.svg";

//images services
import service1 from "../../../assets/trusted/services1.png";
import service2 from "../../../assets/trusted/services2.png";
import service3 from "../../../assets/trusted/services3.png";

export const images = [Bg1, Bg1, Bg1, Bg1];

export const types = [
  { name: "All", icon: sedanIcon }, // Using sedanIcon as placeholder since all.png is missing
  { name: "Sedan", icon: sedanIcon },
  { name: "SUV", icon: suvIcon },
  { name: "Hatchback", icon: hatchbackIcon },
  { name: "Commercial", icon: commercialIcon },
];

export const Slogans = [
  {
    url: Bg1,
    title: "Find Your Dream Car",
    subtitle: "Best deals on pre-owned cars",
  },
  {
    url: Bg1,
    title: "Quality You Can Trust",
    subtitle: "Certified and verified vehicles",
  },
  {
    url: Bg1,
    title: "Drive Your Future",
    subtitle: "Affordable prices for everyone",
  },
];

export const brands = [
  { name: "Suzuki", logo: suzuki },
  { name: "Tata", logo: tata },
  { name: "Mahindra", logo: mahindra },
  { name: "Toyota", logo: toyota },
  { name: "Honda", logo: honda },
  { name: "Hyundai", logo: hyundai },
  { name: "Kia", logo: kia },
  { name: "Renault", logo: renault },
  { name: "Skoda", logo: skoda },
  { name: "Volkswagen", logo: volkswagen },
  { name: "MG", logo: mg },
  { name: "Nissan", logo: nissan },
];

export const services = [service1, service2, service3];
