import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import authService from '../../../../lib/services/auth-service';
import type {
  ForgotPasswordAPIInputT,
  ResetPasswordAPIInputT,
  VerifyResetOtpAPIInputT,
} from '../../../../typs/auth/forget-password/post';
import type { ResendOtpAPIInputT } from '../../../../typs/verify-otp/resend-otp/post';

export const useSendResetOtp = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordAPIInputT) =>
      authService.forgotPassword(payload),
    onSuccess: () => {
      toast.success('Reset code sent to your email');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to send reset code');
    },
  });

export const useVerifyResetOtp = () =>
  useMutation({
    mutationFn: (payload: VerifyResetOtpAPIInputT) =>
      authService.verifyResetOtp(payload),
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Invalid or expired code');
    },
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordAPIInputT) =>
      authService.resetPassword(payload),
    onSuccess: () => {
      toast.success('Password reset successfully. Please log in.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    },
  });

export const useSendResetOtpAgain = () =>
  useMutation({
    mutationFn: (payload: ResendOtpAPIInputT) => authService.resendOtp(payload),
    onSuccess: () => {
      toast.success('Reset code sent to your email');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to send reset code');
    },
  });
