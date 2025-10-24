import { authClient } from "@/utils/auth-client";

export const logOut = async () => {
  await authClient.signOut();
};
