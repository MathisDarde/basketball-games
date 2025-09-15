"use client";

import PeriodSelector from "@/components/PeriodSelector";
import { BrickWallIcon, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const periods = [
  { key: "1990s", label: "1990s Edition", Icon: StarIcon },
  { key: "2000s", label: "2000s Edition" },
  { key: "2010s", label: "2010s Edition", Icon: BrickWallIcon },
  { key: "2020s", label: "2020s Edition", Icon: BrickWallIcon },
];

export default function CareerPathPeriodSelector() {
  const router = useRouter();

  const handlePeriodSelect = (period: string) => {
    router.push(`/nbacollection/${period}`);
  };

  return (
    <div>
      <h1 className="font-unbounded text-center text-2xl">NBA Collection</h1>
      <p className="text-center font-outfit font-light text-sm pt-2">
        Select a period to play
      </p>

      <PeriodSelector periods={periods} onSelect={handlePeriodSelect} />
    </div>
  );
}
