import { authClient } from "@/utils/auth-client";
import { redirect } from "next/navigation";

export const logOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect("/login");
      },
    },
  });
};
