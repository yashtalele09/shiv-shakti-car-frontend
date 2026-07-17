export type VehicleAPIInputT = {
  // Pagination
  page?: number;
  limit?: number | 'all';
  sort?: 'asc' | 'desc';

  // Search
  search?: string;

  // String filters
  body_type?: string | string[];
  vehicle_model?: string | string[];
  vehicle_brand?: string | string[];
  vehicle_varient?: string | string[];
  vehicle_color?: string | string[];
  vehicle_location?: string | string[];
  fuel_type?: string | string[];
  transmission_type?: string | string[];
  vehicle_type?: string | string[];

  // Number range filters
  min_price?: number;
  max_price?: number;
  min_km?: number;
  max_km?: number;
  owner_count?: number;
  registration_year?: number;
};

export type VehicleDataT = {
  _id: string;
  vehicle_id: string;
  vehicle_model: string;
  vehicle_brand: string;
  vehicle_varient: string;
  vehicle_color: string;
  vehicle_location: string;
  vehicle_price: number;
  kilometers_driven: number;
  owner_count: number;
  fuel_type: string;
  transmission_type: string;
  body_type: string;
  registration_year: number;
  insurance_validity: string; // ISO date string from API
  vehicle_description: string;
  vehicle_images_video: string[];
  vehicle_type: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
};

export type GetAllVehicleResponseT = {
  success: boolean;
  message: string;
  vehicleData: {
    data: VehicleDataT[] | [];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
};

export type GetFeaturedVehicleInputT = {
  body_type?: string;
};

export type GetFeaturedVehicleResponseT = {
  success: boolean;
  message: string;
  vehicleData: VehicleDataT[];
};
