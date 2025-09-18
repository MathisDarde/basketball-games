export interface TeamHistory {
  period: string;
  team: string;
}

export type PeriodTypes = "1990s" | "2000s" | "2010s" | "2020s";

export interface PlayerData {
  id: string;
  period: PeriodTypes;
  name: string;
  wikipedia_url: string;
  teams_history: TeamHistory[];
  image_link: string | null;
  position: string | null;
  awards: string[];
}

export interface GridThemeData {
  label: string;
  imageUrl?: string;
  type: string;
}

export interface Card {
  id: string;
  userId: string;
  cardId: string;
  possessed: number | null;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture: string | null;
  favoriteTeam: string;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
}

export interface Filters {
  query: string;
  owned: ("owned" | "notOwned")[];
  rarity: string[];
  teams: string[];  
}
