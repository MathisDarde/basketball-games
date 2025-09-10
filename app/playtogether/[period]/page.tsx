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
      <div className={`p-4`}>
        <PageContent players={players} teams={teams} period={period} />
      </div>
    </>
  );
}
