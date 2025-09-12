import { RegisterSchema, LoginSchema, updateProfileSchema } from "@/app/schema";
import { z, ZodIssue } from "zod";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type updateProfileSchemaType = z.infer<typeof updateProfileSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
};
