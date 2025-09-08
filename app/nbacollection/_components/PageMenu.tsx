import { Card, PlayerData } from "@/interfaces/Interfaces";
import Link from "next/link";

export default async function PageMenu({
  ownedCards,
  players,
  params,
}: {
  ownedCards: Card[];
  players: PlayerData[];
  params: { period: string };
}) {
  const { period } = params;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <p>Amount of cards possessed :</p>
        <p>
          {ownedCards.length}/{players.length}
        </p>
      </div>

      <div>
        <Link href={`/nbacollection/${period}/dailydraw`}>
          Accéder au tirage quotidien
        </Link>
      </div>
    </div>
  );
}
