import { Card, PeriodTypes, PlayerData } from "@/interfaces/Interfaces";
import Link from "next/link";

export default async function PageMenu({
  ownedCards,
  players,
  params,
}: {
  ownedCards: Card[];
  players: PlayerData[];
  params: Promise<{ period: PeriodTypes }>;
}) {
  return (
    <div className="flex flex-col items-center justify-between">
      <div className="font-outfit py-2 px-4 bg-accent-brown text-white mt-4">
        <Link href={`/nbacollection/${(await params).period}/dailydraw`}>
          Daily Draw
        </Link>
      </div>

      <div className="flex gap-2 items-center my-4">
        <p className="font-outfit">Amount of cards possessed :</p>
        <p className="font-outfit">
          {ownedCards.length}/{players.length}
        </p>
      </div>
    </div>
  );
}
