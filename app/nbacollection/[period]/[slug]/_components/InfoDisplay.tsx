"use client";

import CardDisplay from "@/components/card/CardDisplay";
import Button from "@/components/CustomButton";
import { usePlayTogetherCtx } from "@/components/GlobalContext";
import { TeamsData } from "@/components/Teams";
import { PlayerData } from "@/interfaces/Interfaces";
import Image from "next/image";
import Link from "next/link";

type InfoDisplayProps = {
  period: string;
  player: PlayerData;
  isOwned: boolean;
};

export default function InfoDisplay({
  period,
  player,
  isOwned,
}: InfoDisplayProps) {
  const { getTeamLogo } = usePlayTogetherCtx();

  const filteredTeams = player.teams_history.filter(({ team }) =>
    TeamsData.some((t) => t.names.includes(team))
  );

  if (filteredTeams.length === 0) return "Unknown";

  return (
    <>
      {isOwned ? (
        <CardDisplay card={player} isOwned={isOwned} />
      ) : (
        <div className="flex flex-col justify-center items-center text-center px-4 w-[300px] h-[400px] bg-gray-300 rounded-lg mx-auto">
          <p className="text-xl font-bold uppercase font-unbounded text-gray-600">
            {player.name}
          </p>
          <p className="text-sm font-outfit italic text-black/60 mt-2">
            Card not collected
          </p>
        </div>
      )}

      {isOwned ? (
        <div className="text-center my-4">
          <p className="font-unbounded text-xl">
            {player.name} ({player.period})
          </p>
          <p className="font-outfit text-sm">{player.position}</p>

          <div className="flex flex-col items-start gap-2 font-outfit">
            <h3 className="text-base underline">Career</h3>
            {filteredTeams.map((team) => {
              let endYear: number;
              if (team.period.includes("–") || team.period.includes("-")) {
                const parts = team.period.includes("–")
                  ? team.period.split("–")
                  : team.period.split("-");
                const endStr = parts[1];
                endYear =
                  endStr?.trim().toLowerCase() === "present"
                    ? new Date().getFullYear()
                    : parseInt(endStr, 10);
              } else {
                endYear = parseInt(team.period, 10);
              }

              const logo = getTeamLogo(team.team, endYear);

              return (
                <div
                  key={team.team + team.period}
                  className="flex flex-row items-center gap-2"
                >
                  <Image
                    src={logo || "/pdpdebase.png"}
                    alt={`${team.team} logo`}
                    width={50}
                    height={50}
                    className="w-10 h-10 object-contain"
                  />
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-sm">{team.team}</p>
                    <p className="text-sm">{team.period}</p>
                  </div>
                </div>
              );
            })}

            <h3 className="text-base underline">Awards</h3>
            {player.awards && player.awards.length > 0 ? (
              player.awards.map((award, index) => (
                <p key={index} className="text-sm">
                  {award}
                </p>
              ))
            ) : (
              <p className="text-sm font-outfit italic text-gray-500">
                This player has received no award.
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <p className="text-center my-4 font-outfit text-sm">
            You do not possess this card. Please get it in your collection to
            see this player&apos;s details.
          </p>

          <Link href={`/nbacollection/${period}/dailydraw`}>
            <Button size="default" theme="primary">
              Go to my daily draw
            </Button>
          </Link>
        </>
      )}
    </>
  );
}
