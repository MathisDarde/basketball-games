import { PlayerData } from "@/interfaces/Interfaces";

export const getRandomPlayers = ({
  numberPlayers,
  players,
}: {
  numberPlayers: number;
  players: PlayerData[];
}): PlayerData[] => {
  return [...players].sort(() => 0.5 - Math.random()).slice(0, numberPlayers);
};
