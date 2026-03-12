import { z } from "zod";
import {
  emailRegexGenerate,
  passwordRegexGenerate,
} from "../../../../validations";

export const SignInSchema = z.object({
  email: z
    .string()
    .regex(emailRegexGenerate().regex, emailRegexGenerate().message),
  password: z
    .string()
    .regex(passwordRegexGenerate().regex, passwordRegexGenerate().message),
});

export type SignInFormData = z.infer<typeof SignInSchema>;
