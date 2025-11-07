import { ReactNode } from "react";

export interface TeamHistory {
  periods: TeamPeriod[];
  period: string;
  team: string;
  abr: string;
  mainColor: string;
  accentColor: string;
}

export interface TeamPeriod {
  period: string; 
  abr: string;
  logo: string, 
  mainColor: string, 
  accentColor: string
}

export type PeriodTypes = "1990s" | "2000s" | "2010s" | "2020s";

export interface PlayerData {
  id: string;
  period: PeriodTypes;
  name: string;
  wikipedia_url: string;
  teams_history: TeamHistory[];
  image_url: string | null;
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
  image: string | null;
  favoriteTeam: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export interface Filters {
  query: string;
  owned: ("owned" | "notOwned")[];
  rarity: string[];
  teams: string[];
}

export interface TeamsDataType {
  currentName: string;
  names: string[];
  conference: string;
  division: string;
  periods: { period: string; abr: string; logo: string }[];
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  className?: string;
  disabled?: boolean;
}
