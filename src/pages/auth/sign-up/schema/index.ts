import { z } from "zod";
import {
  emailRegexGenerate,
  nameRegexGenerate,
  passwordRegexGenerate,
  phoneRegexGenerate,
} from "../../../../validations";

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .regex(nameRegexGenerate("Please enter a valid Full name", 2, 50).regex, {
        message: nameRegexGenerate("Please enter a valid Full name", 2, 50)
          .message,
      }),
    email: z
      .string()
      .regex(emailRegexGenerate().regex, emailRegexGenerate().message),
    phone: z
      .string()
      .regex(phoneRegexGenerate().regex, phoneRegexGenerate().message),
    password: z
      .string()
      .regex(passwordRegexGenerate().regex, passwordRegexGenerate().message),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof SignUpSchema>;
