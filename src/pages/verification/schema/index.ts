import z from 'zod';

export const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Enter the 6-digit code')
    .regex(/^\d+$/, 'Only digits allowed'),
});
