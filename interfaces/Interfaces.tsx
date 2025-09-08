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
  number: number | null;
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
