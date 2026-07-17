import { useMutation, useQueryClient } from '@tanstack/react-query';
import vehicleService from '../../../lib/services/vehicle-service';
import type { GetFeaturedVehicleInputT } from '../../../typs/vehicle/get';

type UseGetAllVehicleMutationOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

const useGetFeaturedVehicle = (options?: UseGetAllVehicleMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body_type: GetFeaturedVehicleInputT) =>
      vehicleService.getFeaturedVehicle(body_type),
    onSuccess: (data) => {
      // Invalidate and refetch the vehicles query cache
      queryClient.invalidateQueries({ queryKey: ['featured-vehicles'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export default useGetFeaturedVehicle;
