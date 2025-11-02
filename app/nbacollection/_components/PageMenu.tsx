import Button from "@/components/CustomButton";
import { Card, PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import Link from "next/link";

export default async function PageMenu({
  players,
  params,
  ownedByPeriod,
}: {
  players: PlayerData[];
  params: Promise<{ period: PeriodTypes }>;
  ownedByPeriod: Card[];
}) {
  return (
    <div className="flex flex-col items-center justify-between">
        <Link href={`/nbacollection/${(await params).period}/dailydraw`}>
          <Button theme="secondary" size="default" className="mt-4">
          Daily Draw
          </Button>
        </Link>

      <div className="flex gap-2 items-center my-4">
        <p className="font-outfit text-base sm:text-xl">Amount of cards possessed :</p>
        <p className="font-outfit text-base sm:text-xl">
          {ownedByPeriod.length}/{players.length}
        </p>
      </div>
    </div>
  );
}
