import { getAuthenticatedUser } from "@/actions/user/get-connected-user";
import { NavbarMenu } from "./NavbarClient";

export default async function NavbarServer() {
  const user = await getAuthenticatedUser();

  return <NavbarMenu user={user} />;
}
