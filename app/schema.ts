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
