import { InscSchema, LoginSchema } from "@/app/schema";
import { z, ZodIssue } from "zod";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type InscSchemaType = z.infer<typeof InscSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
};
