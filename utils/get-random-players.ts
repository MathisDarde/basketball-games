import { PlayerData } from "@/interfaces/Interfaces";

export function getRandomPlayers({
  numberPlayers,
  players,
}: {
  numberPlayers: 1;
  players: PlayerData[];
}): PlayerData;

export function getRandomPlayers({
  numberPlayers,
  players,
}: {
  numberPlayers: number;
  players: PlayerData[];
}): PlayerData[];

export function getRandomPlayers({
  numberPlayers,
  players,
}: {
  numberPlayers: number;
  players: PlayerData[];
}): PlayerData | PlayerData[] {
  const shuffled = [...players].sort(() => 0.5 - Math.random());

  if (numberPlayers === 1) {
    return shuffled[0];
  }

  return shuffled.slice(0, numberPlayers);
}
