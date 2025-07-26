export interface TeamHistory {
  period: string;
  team: string;
}

export interface PlayerData {
  id: string;
  name: string;
  wikipedia_url: string;
  teams_history: TeamHistory[];
  image_link: string;
  number: number;
  position: string;
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
