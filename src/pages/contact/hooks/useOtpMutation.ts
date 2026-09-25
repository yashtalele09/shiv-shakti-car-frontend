import { useMutation } from '@tanstack/react-query';
import { showToast } from '../../../utils/toast';
import { AxiosError } from 'axios';
import inquiryService from '../../../lib/services/inquiry-service';
import type { APIFailureData } from '../../../typs/shared';
import type {
  SendOtpPayloadT,
  SendOtpResponseT,
  VerifyOtpPayloadT,
  VerifyOtpResponseT,
} from '../../../typs/inquiry';

export const useSendOtp = () => {
  return useMutation<
    SendOtpResponseT,
    AxiosError<APIFailureData>,
    SendOtpPayloadT
  >({
    mutationFn: inquiryService.sendOtp,
    onSuccess: (response) => {
      showToast.success(response.message || 'OTP sent to your email');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to send OTP. Please try again.';
      showToast.error(message);
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation<
    VerifyOtpResponseT,
    AxiosError<APIFailureData>,
    VerifyOtpPayloadT
  >({
    mutationFn: inquiryService.verifyOtp,
    onSuccess: (response) => {
      showToast.success(response.message || 'Email verified successfully');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Invalid OTP. Please try again.';
      showToast.error(message);
    },
  });
};
