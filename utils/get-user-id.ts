import { authClient } from "./auth-client";

export const getUserId = async () => {
  const session = await authClient.getSession();
  const user_id = session?.data?.user.id || null;
  return user_id;
};
