"use client";

import PeriodSelector from "@/components/PeriodSelector";
import { BrickWallIcon, StarIcon } from "lucide-react";

const periods = [
  { key: "2020s", label: "2020s Edition", Icon: BrickWallIcon },
  { key: "1990s", label: "1990s Edition", Icon: StarIcon },
  { key: "2000s", label: "2000s Edition" },
  { key: "2010s", label: "2010s Edition", Icon: BrickWallIcon },
];

export default function CareerPathPeriodSelector() {
  return <PeriodSelector periods={periods} basePath="/playtogether" />;
}
