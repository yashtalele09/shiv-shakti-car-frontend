import type {
  SignUpAPIInputT,
  SignUpAPISuccessResponseT,
} from '../../typs/auth/sign-up/post';
import { authInstance } from '../../axios';
import type {
  SignInAPIInputT,
  SignInAPISuccessResponseT,
} from '../../typs/auth/sign-in/post';
import type { VerifyOtpAPIInputT } from '@/typs/verify-otp/post';
import type { ResendOtpAPIInputT } from '@/typs/verify-otp/resend-otp/post';
import type {
  ForgotPasswordAPIInputT,
  ForgotPasswordAPISuccessResponseT,
  VerifyResetOtpAPIInputT,
  VerifyResetOtpAPISuccessResponseT,
  ResetPasswordAPIInputT,
  ResetPasswordAPISuccessResponseT,
} from '@/typs/auth/forget-password/post';

const authService = {
  signUp: async (data: SignUpAPIInputT): Promise<SignUpAPISuccessResponseT> => {
    const response = await authInstance.post('auth/register', data);
    return response.data;
  },

  signIn: async (data: SignInAPIInputT): Promise<SignInAPISuccessResponseT> => {
    const response = await authInstance.post('auth/login', data);
    return response.data;
  },

  googleAuth: async (idToken: string): Promise<SignUpAPISuccessResponseT> => {
    const response = await authInstance.post('auth/firebase', {
      idToken: idToken,
    });
    return response.data;
  },

  verifyOtp: async (
    data: VerifyOtpAPIInputT
  ): Promise<SignUpAPISuccessResponseT> => {
    const response = await authInstance.post('auth/verify-otp', {
      email: data.email,
      otp: data.otp,
    });
    return response.data;
  },

  verifyResetOtp: async (
    data: VerifyResetOtpAPIInputT
  ): Promise<VerifyResetOtpAPISuccessResponseT> => {
    const response = await authInstance.post('auth/reset-verify-otp', {
      email: data.email,
      otp: data.otp,
    });
    return response.data;
  },

  resendOtp: async (
    data: ResendOtpAPIInputT
  ): Promise<SignUpAPISuccessResponseT> => {
    const response = await authInstance.post('auth/resend-otp', {
      email: data.email,
    });
    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordAPIInputT
  ): Promise<ForgotPasswordAPISuccessResponseT> => {
    const response = await authInstance.post('auth/forgot-password', {
      email: data.email,
    });
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordAPIInputT
  ): Promise<ResetPasswordAPISuccessResponseT> => {
    const response = await authInstance.post('auth/reset-password', {
      resetToken: data.resetToken,
      newPassword: data.newPassword,
    });
    return response.data;
  },
};

export default authService;
