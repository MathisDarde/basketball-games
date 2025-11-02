import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Le mail que vous avez entré n'est pas valide." }),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir plus de 8 caractères !")
    .nonempty({ message: "Veuillez entrer un mot de passe." }),
});

export const RegisterSchema = z
  .object({
    name: z.string().nonempty({ message: "Veuillez renseigner un pseudo." }),
    favorite_team: z
      .string()
      .nonempty({ message: "Veuillez sélectionner une équipe." }),
    email: z
      .string()
      .email({ message: "Le mail que vous avez entré n'est pas valide." }),
    password: z
      .string()
      .min(8, "Veuillez entrer plus de 8 caractères !")
      .nonempty({ message: "Veuillez entrer un mot de passe." }),
    confirmPassword: z
      .string()
      .min(8, "Veuillez entrer plus de 8 caractères !")
      .nonempty({ message: "Veuillez confirmer le mot de passe." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas !",
    path: ["confirmPassword"],
  });

const TeamHistorySchema = z.object({
  period: z.string(),
  team: z.string(),
});

export const PlayersSchema = z.object({
  period: z.string().nonempty(),
  name: z.string().nonempty(),
  image_url: z.string().url(),
  position: z.string().nonempty(),
  teams_history: z.array(TeamHistorySchema).optional(),
  awards: z.array(z.string()).optional(),
  wikipedia_url: z.string().url().nonempty(),
});

export const updateProfileSchema = z.object({
  name: z.string().nonempty({ message: "Veuillez renseigner un pseudo." }),
  favorite_team: z
    .string()
    .nonempty({ message: "Veuillez sélectionner une équipe." }),
  email: z
    .string()
    .email({ message: "Le mail que vous avez entré n'est pas valide." }),
  image: z.string().optional(),
});
