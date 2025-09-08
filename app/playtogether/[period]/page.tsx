import Difficulty from "@/components/Difficulty";
import Link from "next/link";
import { getPlayers } from "@/controllers/PlayersController";
import { teams } from "@/components/Teams";
import PageContent from "../_components/PageContent";
import { PeriodTypes } from "@/interfaces/Interfaces";

export default async function PlayTogetherPeriodPage({
  params,
}: {
  params: { period: PeriodTypes };
}) {
  const { period } = params;

  const players = await getPlayers(period);

  return (
    <>
      <div className="flex items-center gap-6">
        <Link href="/">
          <h1 className="cursor-pointer">Back to home</h1>
        </Link>
        <Link href="/playtogether">
          <h1 className="cursor-pointer">Back to era selection</h1>
        </Link>
      </div>

      <Difficulty />

      <div className={`p-4`}>
        <PageContent players={players} teams={teams} period={period} />
      </div>
    </>
  );
}
