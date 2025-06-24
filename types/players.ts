import { PlayersSchema } from "@/app/schema";
import { z, ZodIssue } from "zod";

export type PlayersSchemaType = z.infer<typeof PlayersSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
};
