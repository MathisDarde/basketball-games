import { authClient } from "@/utils/auth-client";

const handleLoginWithTwitter = async () => {
  await authClient.signIn.social({
    provider: "twitter",
    callbackURL: "/",
  });
};

export default handleLoginWithTwitter;
