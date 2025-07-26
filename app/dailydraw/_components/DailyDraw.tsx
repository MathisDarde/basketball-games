"use client";

import storeCardInCollection from "@/actions/cardcollection/addcardtocollection";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { PlayerData } from "@/interfaces/Interfaces";
import { authClient } from "@/utils/auth-client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function DailyDraw({
  players,
  teams,
}: {
  players: PlayerData[];
  teams: string[];
}) {
  const { getRandomPlayers, getTeamLogo, formatPosition, getBackgroundClass } =
    usePlayTogetherCtx();

  const getUserId = async () => {
    const session = await authClient.getSession();
    const user_id = session?.data?.user.id || null;
    return user_id;
  };

  const randomPlayers = getRandomPlayers({ numberPlayers: 5, players });

  const [flipped, setFlipped] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || flipped.length >= 5) return;

    const updatedFlipped = [...flipped, index];
    setFlipped(updatedFlipped);
  };

  const handleRedirectAndStore = async () => {
    const userId = await getUserId();

    if (!userId) return;

    const flippedPlayers = flipped.map((index) => randomPlayers[index]);

    for (const player of flippedPlayers) {
      await storeCardInCollection(player.id, userId);
    }

    redirect("/nbacollection");
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {randomPlayers.map((player, index) => {
          const isFlipped = flipped.includes(index);
          const { name, image_link, teams_history, number, position } = player;

          const nameParts = name.split(" ");

          const filteredTeams = teams_history.filter(({ team }) =>
            teams.some((t) => team.includes(t))
          );

          if (filteredTeams.length === 0) return "Unknown";

          const lastTeam = filteredTeams[filteredTeams.length - 1];
          const { team } = lastTeam;
          const teamLogo = getTeamLogo(team);

          const backgroundClass = getBackgroundClass();

          return (
            <div
              key={index}
              className="relative w-[288px] h-[400px] cursor-pointer border rounded overflow-hidden"
              onClick={() => handleCardClick(index)}
            >
              {!isFlipped ? (
                <Image
                  src="/cardback.png"
                  alt="Back of the card"
                  width={96}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`relative overflow-hidden h-[400px] px-4 pb-4 pt-12 ${backgroundClass} rounded-lg shadow transition-shadow`}
                >
                  <div className="relative text-sm text-gray-600 flex items-center gap-2">
                    <div className="absolute -top-9 -left-1">
                      {teamLogo && (
                        <Image
                          src={teamLogo}
                          alt={`${team} logo`}
                          width={50}
                          height={50}
                          className="inline-block size-14 object-fit"
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute right-4 top-3 rounded-full w-14 h-14 bg-black flex items-center justify-center">
                    <p className=" italic font-righteous text-2xl text-white">{`#${number}`}</p>
                  </div>
                  <div
                    className={`bg-[url('/motifbackground90s.jpg')] bg-cover bg-center w-full h-full rounded-t-full flex flex-col overflow-hidden`}
                  >
                    <div className="flex-1 relative w-full">
                      <Image
                        src={image_link ? image_link : "/pdpdebase.png"}
                        alt={name}
                        fill
                        className="object-cover"
                        quality={100}
                      />
                    </div>
                    <div className="h-fit p-2 bg-black text-white uppercase flex items-center justify-center">
                      <div className="flex gap-2 justify-center items-center text-center font-righteous flex-5 ">
                        <div className="flex flex-col items-center">
                          <span className="text-sm">{nameParts[0]}</span>
                          <span className="text-xl">
                            {nameParts.slice(1).join(" ")}
                          </span>
                        </div>
                      </div>
                      <div className=" flex-1">
                        <span className="flex items-center justify-center font-righteous text-md bg-white text-black rounded-full w-full aspect-square">
                          {formatPosition(position)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {flipped.length === 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleRedirectAndStore}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded mt-4 cursor-pointer"
          >
            Voir ma collection
          </button>
        </div>
      )}
    </>
  );
}
