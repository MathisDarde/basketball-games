"use client"

import { usePlayTogetherCtx } from "@/components/GlobalContext"
import { User } from "@/interfaces/Interfaces";
import Image from "next/image"

export const ProfileContent = ({ user }: { user: User | null }) => {
    const { getTeamLogo } = usePlayTogetherCtx();

    if(!user?.favoriteTeam)
        return;
    
    const teamLogo = getTeamLogo(user?.favoriteTeam, 2025);
    
    return (
        <div className="">
            <div className="my-4 space-y-2">
                <Image
                    src={user?.profilePicture || "/pdpdebase.png"}
                    alt="Profile picture"
                    width={100}
                    height={100}
                    className="rounded-full aspect-square object-cover mx-auto"
                />
                <h2 className="font-unbounded text-center">{user?.name}</h2>
            </div>

            <div className="space-y-2">
                <div className="font-outfit text-sm">
                    {user?.email}
                </div>
                <div className="font-outfit text-sm">
                    First registered on {user?.createdAt.toLocaleDateString()}
                </div>
                <div className="font-outfit text-sm flex items-center gap-2">
                    {user?.favoriteTeam}

                    <Image
                        src={teamLogo || "/pdpdebase.png"}
                        alt="Team logo"
                        width={18}
                        height={18}
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="my-4">
                <h3 className="font-unbounded text-center">Statistics</h3>
            </div>
        </div>
    )
}