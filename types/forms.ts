import { RegisterSchema, LoginSchema } from "@/app/schema";
import { z, ZodIssue } from "zod";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
};
