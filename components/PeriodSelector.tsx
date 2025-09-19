"use client";

import { BrickWallIcon } from "lucide-react";

type PeriodOption = {
  key: string;
  label: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function PeriodSelector({
  periods,
  onSelect,
}: {
  periods: PeriodOption[];
  onSelect: (period: string) => void;
}) {
  const handleSelect = (period: string) => {
    onSelect(period);
  };

  return (
    <div className="p-4 max-w-[600px] mx-auto">
      <div className="flex gap-4 flex-col w-full">
        {periods.map(({ key, label, Icon }) => (
          <div
            key={key}
            className="cursor-pointer p-4 rounded-md bg-dark-purple text-white flex items-center justify-center gap-2 w-full"
            onClick={() => handleSelect(key)}
          >
            {Icon ? <Icon /> : <BrickWallIcon />}
            <p className="font-outfit md:text-lg 2xl:text-xl">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
