"use server";

import { RegisterSchema } from "@/app/schema";
import { signUp } from "@/controllers/UserController";
import { FormResponse, RegisterSchemaType } from "@/types/forms";

const submitRegisterForm = async (
  data: RegisterSchemaType,
  file?: File | null
): Promise<FormResponse> => {
  try {
    const parsedData = RegisterSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    console.log("File param :", file);

    try {
      await signUp(parsedData.data, file ?? undefined);
      return { success: true, message: "Account created !" };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "An error was encountered during the registration.",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "An error was encounted during the registration.",
    };
  }
};

export default submitRegisterForm;
