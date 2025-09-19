"use client";

import DifficultySelector from "@/components/DifficultySelector";
import PeriodSelector from "@/components/PeriodSelector";
import { BrickWallIcon, StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const periods = [
  { key: "1990s", label: "1990s Edition", Icon: StarIcon },
  { key: "2000s", label: "2000s Edition" },
  { key: "2010s", label: "2010s Edition", Icon: BrickWallIcon },
  { key: "2020s", label: "2020s Edition", Icon: BrickWallIcon },
];

export default function CareerPathPeriodSelector() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const router = useRouter();

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setStep(2);
  };

  const handleDifficultySelect = (difficulty: string) => {
    if (!selectedPeriod) return;
    router.push(`/playtogether/${selectedPeriod}?difficulty=${difficulty}`);
  };

  return (
    <div>
      <h1 className="font-unbounded text-center text-2xl md:text-3xl 2xl:text-4xl">Play together</h1>
      <p className="text-center font-outfit font-light text-sm pt-2 md:text-lg 2xl:text-xl">
        {step === 1 ? "Select a period to play" : "Choose your difficulty"}
      </p>

      {step > 1 && (
        <p
          className="text-center font-outfit font-light text-sm md:text-base 2xl:text-lg pt-2 underline text-dark-purple cursor-pointer"
          onClick={() => setStep(1)}
        >
          Back to period selection
        </p>
      )}

      {step === 1 && (
        <PeriodSelector periods={periods} onSelect={handlePeriodSelect} />
      )}

      {step === 2 && <DifficultySelector onSelect={handleDifficultySelect} />}
    </div>
  );
}
