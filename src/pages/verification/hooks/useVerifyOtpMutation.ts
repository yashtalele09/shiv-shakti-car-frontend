import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import type {
  VerifyOtpAPIInputT,
  VerifyOtpAPISuccessResponseT,
} from '../../../typs/verify-otp/post';
import authService from '../../../lib/services/auth-service';
import type { APIFailureData } from '../../../typs/shared';

type UseVerifyOtpMutationOptions = {
  onSuccess?: (data: VerifyOtpAPISuccessResponseT) => void;
  onError?: (error: APIFailureData) => void;
};

export const useVerifyOtpMutation = (options?: UseVerifyOtpMutationOptions) => {
  return useMutation({
    mutationFn: ({ data }: { data: VerifyOtpAPIInputT }) =>
      authService.verifyOtp(data),
    onSuccess: (data: VerifyOtpAPISuccessResponseT) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<APIFailureData>) => {
      options?.onError?.({
        error: error.response?.data?.error || 'Something went wrong',
        message: error.response?.data?.message || 'Something went wrong',
      });
    },
  });
};
