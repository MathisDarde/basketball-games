"use server";

import { updateProfileSchema } from "@/app/schema";
import { updateUser } from "@/controllers/UserController";
import { FormResponse, updateProfileSchemaType } from "@/types/forms";

// Cette fonction met à jour le profil de l'utilisateur avec les données et le fichier
const updateProfileForm = async (
  userId: string,
  data: updateProfileSchemaType,
  file?: File
): Promise<FormResponse> => {
  try {
    const parsedData = updateProfileSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const updateProfile = await updateUser(userId, parsedData.data, file);

    if (!updateProfile) {
      return {
        success: false,
        message: "Erreur lors de la modification du profil",
      };
    }

    return { success: true, message: "Profil mis à jour avec succès" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la modification du profil",
    };
  }
};

export default updateProfileForm;
