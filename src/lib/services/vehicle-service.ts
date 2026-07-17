import { instance } from '../../axios';
import type {
  GetFeaturedVehicleInputT,
  VehicleAPIInputT,
} from '../../typs/vehicle/get';

const vehicleService = {
  getAllVehicle: async (data?: VehicleAPIInputT) => {
    const response = await instance.get('/vehicle/get-all-vehicle', {
      params: data,
    });
    return response.data;
  },

  getFeaturedVehicle: async (data: GetFeaturedVehicleInputT) => {
    const response = await instance.get('/vehicle/get-all-featured-vehicle', {
      params: {
        body_type: data?.body_type,
      },
    });
    return response.data;
  },
  getVehicleById: async (data: { id: string }) => {
    const response = await instance.get('/vehicle/get-vehicle-by-id', {
      params: {
        vehicle_id: data?.id,
      },
    });
    return response.data;
  },
};

export default vehicleService;
