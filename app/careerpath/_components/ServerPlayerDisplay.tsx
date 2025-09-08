// app/career-path/_components/ServerPlayerDisplay.tsx
import { PlayerData } from "@/interfaces/Interfaces";
import { getRandomPlayers } from "@/utils/get-random-players";
import Image from "next/image";
import ClientPlayerInteraction from "./ClientPlayerInteraction";

export default function ServerPlayerDisplay({
  players,
  teams,
}: {
  players: PlayerData[];
  teams: string[];
}) {
  const [player] = getRandomPlayers({ numberPlayers: 1, players });

  return (
    <div className="flex flex-col items-center border rounded-md p-4">
      <Image
        src={player.image_link}
        width={100}
        height={100}
        alt="Player picture"
      />
      <p className="text-center">{player.name}</p>
      <ClientPlayerInteraction player={player} teams={teams} />
    </div>
  );
}
