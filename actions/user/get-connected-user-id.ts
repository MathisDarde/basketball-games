"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export const getAuthenticatedUserId = async (): Promise<string | null> => {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: new Headers(requestHeaders),
    });

    const userId = session?.user?.id ?? null;
    return userId;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};
