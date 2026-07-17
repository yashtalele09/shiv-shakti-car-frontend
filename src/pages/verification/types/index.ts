import { z } from 'zod';
import { OtpSchema } from '../schema/index';

export type OtpFormData = z.infer<typeof OtpSchema>;
