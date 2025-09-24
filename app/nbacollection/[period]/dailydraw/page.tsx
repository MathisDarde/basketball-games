import { getPlayersByPeriod } from "@/controllers/PlayersController";
import { getDailyDraw } from "@/controllers/DailyDrawController";
import { getAuthenticatedUserId } from "@/actions/user/get-connected-user-id";
import CountdownToNextDraw from "./_components/CountdownToNextDraw";
import { PeriodTypes } from "@/interfaces/Interfaces";
import DailyDrawClient from "./_components/DrawClient";
import { TeamsData } from "@/components/Teams";

export default async function DailyDrawPage({
  params,
}: {
  params: { period: PeriodTypes };
}) {
  const { period } = params;

  const userId = await getAuthenticatedUserId();
  if (!userId) return <p>Vous devez être connecté.</p>;

  const allPlayers = await getPlayersByPeriod(period);

  const { players, flippedIds } = await getDailyDraw(
    userId,
    allPlayers,
    period
  );

  return (
    <>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-unbounded ">Daily Draw</h1>
        <p className="text-md font-outfit">{period}</p>
      </div>

      <DailyDrawClient
        initialPlayers={players}
        flippedInitial={flippedIds}
        allPlayers={allPlayers}
        teams={TeamsData}
        userId={userId}
        period={period}
      />

      <CountdownToNextDraw />
    </>
  );
}
