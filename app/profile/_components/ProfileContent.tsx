"use client";

import deleteAccount from "@/actions/user/delete-user";
import { logOut } from "@/actions/user/log-out";
import ActionPopup from "@/components/ActionPopup";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { User } from "@/interfaces/Interfaces";
import { CalendarCheckIcon, LogOut, Mail, Trash, BellIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StatisticsBlock from "./StatisticsBlock";

export const ProfileContent = ({
  user,
  PTHighestStreak,
  totalPlayTogetherGames,
  totalCards,
  totalPlayers,
}: {
  user: User | null;
  PTHighestStreak: number;
  totalPlayTogetherGames: number;
  totalCards: number;
  totalPlayers: number;
}) => {
  const { getTeamLogo } = usePlayTogetherCtx();
  const router = useRouter();
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  const teamLogo = getTeamLogo(user?.favoriteTeam ?? "", 2025);

  const handleDeleteAccount = async () => {
    const userId = user?.id;

    if (!userId) {
      return;
    }
    const result = await deleteAccount(userId);

    if (result.success) {
      router.push("/login");
    }
  };

  return (
    <>
      {/* Logout Popup */}
      {logoutPopupOpen && (
        <ActionPopup
          onClose={() => setLogoutPopupOpen(false)}
          title="Log Out"
          description="Are you sure you want to log out ?"
          actions={[
            {
              label: "Discard",
              onClick: () => setLogoutPopupOpen(false),
              theme: "discard",
            },
            {
              label: "Logout",
              onClick: () => {
                logOut();
                setLogoutPopupOpen(false);
              },
              theme: "confirm",
            },
          ]}
        />
      )}

      {/* Delete Popup */}
      {deletePopupOpen && (
        <ActionPopup
          onClose={() => setDeletePopupOpen(false)}
          title="Delete this account"
          description="This action is irreversible. All data will be lost. Are you sure you want to proceed ?"
          actions={[
            {
              label: "Discard",
              onClick: () => setDeletePopupOpen(false),
              theme: "discard",
            },
            {
              label: "Delete",
              onClick: () => {
                handleDeleteAccount();
                setDeletePopupOpen(false);
              },
              theme: "delete",
            },
          ]}
        />
      )}

      <div className="">
        <div className="my-4 space-y-2 text-center">
          <Image
            src={user?.image || "/pdpdebase.png"}
            alt="Profile picture"
            width={125}
            height={125}
            className="rounded-full aspect-square object-cover mx-auto"
          />
          <h2 className="font-unbounded text-center">{user?.name}</h2>
          <Link
            href={"/profile/update"}
            className="text-accent-brown underline text-center font-outfit text-sm"
          >
            Edit this profile
          </Link>
        </div>

        <div className="space-y-2">
          <div className="font-outfit text-sm flex items-center justify-center gap-2">
            <Mail size={18} />
            {user?.email}
          </div>
          <div className="font-outfit text-sm flex items-center justify-center gap-2">
            <CalendarCheckIcon size={18} />
            First registered on {user?.createdAt.toLocaleDateString()}
          </div>
          {user?.favoriteTeam && (
            <div className="font-outfit text-sm flex items-center justify-center gap-2">
              <BellIcon size={18} />

              {user?.favoriteTeam}

              <Image
                src={teamLogo || "/pdpdebase.png"}
                alt="Team logo"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
          )}
        </div>

        <div className="mb-4 mt-8">
          <h2 className="text-center font-unbounded text-2xl">Statistics</h2>

          <StatisticsBlock
            PTHighestStreak={PTHighestStreak}
            totalPlayTogetherGames={totalPlayTogetherGames}
            totalCards={totalCards}
            totalPlayers={totalPlayers}
          />
        </div>

        <div className="flex flex-col items-center gap-4 ">
          <div
            className="flex items-center gap-2 bg-dark-purple hover:bg-fuchsia-950 text-white px-4 py-2 rounded font-outfit cursor-pointer"
            onClick={() => setLogoutPopupOpen(true)}
          >
            <LogOut size={18} />
            <button className="cursor-pointer text-sm">Logout</button>
          </div>
          <div
            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-outfit cursor-pointer"
            onClick={() => setDeletePopupOpen(true)}
          >
            <Trash size={18} />
            <button className="cursor-pointer text-sm">
              Delete this account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
