import z from "zod";
import { SignUpSchema } from "../schema";

export type SignUpInput = z.infer<typeof SignUpSchema>;
