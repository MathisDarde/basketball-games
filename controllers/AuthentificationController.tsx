"use server";

import { auth } from "@/utils/auth";
import { LoginSchemaType } from "@/types/forms";

export const signIn = async (data: LoginSchemaType) => {
  await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });
};
