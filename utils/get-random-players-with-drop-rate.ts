import { PlayerData } from "@/interfaces/Interfaces";

// 🎲 Taux de drop fixes par rareté
const DROP_RATES: Record<string, number> = {
  bronze: 50,
  silver: 30,
  gold: 20,
  emerald: 10,
  ruby: 8,
  diamond: 1,
};

/**
 * Tire un ou plusieurs joueurs aléatoirement selon la rareté (pondéré par taux de drop).
 * @param numberPlayers nombre de joueurs à tirer
 * @param players liste complète des joueurs disponibles
 * @param allowDuplicates si false, on évite les doublons dans le tirage
 */
export function getRandomPlayersByDropRate({
  numberPlayers,
  players,
  allowDuplicates = true,
}: {
  numberPlayers: number;
  players: PlayerData[];
  allowDuplicates?: boolean;
}): PlayerData[] {
  const results: PlayerData[] = [];
  const availablePlayers = [...players];

  for (let i = 0; i < numberPlayers && availablePlayers.length > 0; i++) {
    // 🧮 Création de la pool pondérée
    const weightedPool = availablePlayers.flatMap((player) => {
      const rarity = player.rarity?.toLowerCase() ?? "common";
      const weight = DROP_RATES[rarity] ?? 1;
      return Array(weight).fill(player);
    });

    // 🎯 Sélection aléatoire
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const selected = weightedPool[randomIndex];
    results.push(selected);

    // 🚫 Si on ne veut pas de doublons, on retire le joueur choisi
    if (!allowDuplicates) {
      const indexToRemove = availablePlayers.findIndex(
        (p) => p.id === selected.id
      );
      if (indexToRemove !== -1) availablePlayers.splice(indexToRemove, 1);
    }
  }

  return results;
}
