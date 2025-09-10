"use client";

import { BrickWallIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type PeriodOption = {
  key: string;
  label: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function PeriodSelector({
  periods,
  basePath,
}: {
  periods: PeriodOption[];
  basePath?: string;
}) {
  const router = useRouter();

  const handleSelect = (period: string) => {
    router.push(`${basePath || ""}/${period}`);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 flex-col">
        {periods.map(({ key, label, Icon }) => (
          <div
            key={key}
            className="cursor-pointer p-4 rounded-md bg-dark-purple text-white flex items-center gap-2"
            onClick={() => handleSelect(key)}
          >
            {Icon ? <Icon /> : <BrickWallIcon />}
            <p className="font-outfit">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
