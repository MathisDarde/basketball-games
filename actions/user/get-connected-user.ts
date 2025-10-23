"use server";

import { User } from "@/interfaces/Interfaces";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: new Headers(requestHeaders),
    });

    const user = session?.user
      ? {
          ...session.user,
          image: session.user.image ?? null,
          favoriteTeam: session.user.favorite_team,
        }
      : null;
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};
