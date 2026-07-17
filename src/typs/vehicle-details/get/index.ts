export type VehicleDataSuccessT = {
  _id: string;
  vehicle_id: string;
  vehicle_model: string;
  vehicle_brand: string;
  vehicle_varient: string;
  vehicle_color: string;
  vehicle_location: string;
  vehicle_price: number;
  kilometers_driven: number;
  fuel_type: string;
  transmission_type: string;
  body_type: string;
  registration_year: number;
  insurance_validity: string;
  vehicle_description: string;
  vehicle_images_video: string[];
  vehicle_type: string;
  isFeatured: boolean;
  createdAt: string;
}