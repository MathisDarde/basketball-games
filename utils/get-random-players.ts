import { PlayerData } from "@/interfaces/Interfaces";

// Surcharge 1 : si numberPlayers vaut exactement 1 -> retourne un seul joueur
export function getRandomPlayers(args: {
  numberPlayers: 1;
  players: PlayerData[];
}): PlayerData;

// Surcharge 2 : si numberPlayers est quelconque -> retourne un tableau
export function getRandomPlayers(args: {
  numberPlayers: number;
  players: PlayerData[];
}): PlayerData[];

// Implémentation
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
