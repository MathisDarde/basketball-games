import { getUserId } from "@/utils/get-user-id";
import UpdateProfileForm from "./_components/UpdateProfileForm";
import { getUserById } from "@/controllers/UserController";

export default async function UpdateProfilePage() {
  const userId = await getUserId();

  if (!userId) return;

  const userData = await getUserById(userId);

  return (
    <div>
      <h1 className="text-center font-unbounded text-xl">
        Update profile form
      </h1>

      <UpdateProfileForm userData={userData} />
    </div>
  );
}
