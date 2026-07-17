import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import type {
  ResendOtpAPIInputT,
  ResendOtpAPISuccessResponseT,
} from '../../../typs/verify-otp/resend-otp/post';
import authService from '../../../lib/services/auth-service';
import type { APIFailureData } from '../../../typs/shared';

type UseResendOtpMutationOptions = {
  onSuccess?: (data: ResendOtpAPISuccessResponseT) => void;
  onError?: (error: APIFailureData) => void;
};

export const useResendOtpMutation = (options?: UseResendOtpMutationOptions) => {
  return useMutation({
    mutationFn: ({ data }: { data: ResendOtpAPIInputT }) =>
      authService.resendOtp(data),
    onSuccess: (data: ResendOtpAPISuccessResponseT) => {
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
