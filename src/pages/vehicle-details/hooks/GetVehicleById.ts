import { useMutation, useQueryClient } from '@tanstack/react-query';
import vehicleService from '../../../lib/services/vehicle-service';


type UseGetVehicleByIdMutationOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

const useGetVehicleByIdMutation = (
  options?: UseGetVehicleByIdMutationOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {id: string}) =>
      vehicleService.getVehicleById(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
export default useGetVehicleByIdMutation;
