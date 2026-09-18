type ForgotPasswordAPIInputT = {
  email: string;
};

type ForgotPasswordAPISuccessResponseT = {
  success: boolean;
  message: string;
};

type VerifyResetOtpAPIInputT = {
  email: string;
  otp: string;
};

type VerifyResetOtpAPISuccessResponseT = {
  success: boolean;
  message: string;
  data: {
    resetToken: string;
  };
};

type ResetPasswordAPIInputT = {
  resetToken: string;
  newPassword: string;
};

type ResetPasswordAPISuccessResponseT = {
  success: boolean;
  message: string;
};

export type {
  ForgotPasswordAPIInputT,
  ForgotPasswordAPISuccessResponseT,
  VerifyResetOtpAPIInputT,
  VerifyResetOtpAPISuccessResponseT,
  ResetPasswordAPIInputT,
  ResetPasswordAPISuccessResponseT,
};
