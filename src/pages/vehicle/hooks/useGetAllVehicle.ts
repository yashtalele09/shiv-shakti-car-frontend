import { useMutation, useQueryClient } from '@tanstack/react-query';
import vehicleService from '../../../lib/services/vehicle-service';
import type { VehicleAPIInputT } from '../../../typs/vehicle/get';

type UseGetAllVehicleMutationOptions = {
  onSuccess?: (data: any, variables: VehicleAPIInputT) => void;
  onError?: (error: any) => void;
};

const useGetAllVehicleMutation = (
  options?: UseGetAllVehicleMutationOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: VehicleAPIInputT) =>
      vehicleService.getAllVehicle(params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle'] });
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
export default useGetAllVehicleMutation;
