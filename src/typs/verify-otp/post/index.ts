export type VerifyOtpAPIInputT = {
  email: string;
  otp: string;
};

export type VerifyOtpAPISuccessResponseT = {
  success: boolean;
  message: string;
};
