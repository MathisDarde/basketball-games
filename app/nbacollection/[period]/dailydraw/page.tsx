import { getPlayersByPeriod } from "@/controllers/PlayersController";
import { getDailyDraw } from "@/controllers/DailyDrawController";
import { getAuthenticatedUserId } from "@/actions/user/get-connected-user-id";
import CountdownToNextDraw from "./_components/CountdownToNextDraw";
import { PeriodTypes } from "@/interfaces/Interfaces";
import DailyDrawClient from "./_components/DrawClient";
import { TeamsData } from "@/components/Teams";
import { getUserById } from "@/controllers/UserController";

export default async function DailyDrawPage({
  params,
}: {
  params: { period: PeriodTypes };
}) {
  const { period } = params;

  const userId = await getAuthenticatedUserId();
  if (!userId) return <p>Vous devez être connecté.</p>;

  const user = await getUserById(userId);
  const userRole = user.role;

  const allPlayers = await getPlayersByPeriod(period);

  const { players } = await getDailyDraw(userId, allPlayers, period, userRole);

  return (
    <>
      <div className="text-center mb-4">
        <h1 className="font-unbounded text-2xl md:text-3xl 2xl:text-4xl">
          Daily Draw
        </h1>
        <p className="text-sm md:text-lg 2xl:text-xl font-light pt-2">{period}</p>
      </div>

      <DailyDrawClient
        initialPlayers={players}
        allPlayers={allPlayers}
        teams={TeamsData}
        userId={userId}
        userRole={userRole}
        period={period}
      />

      <CountdownToNextDraw />
    </>
  );
}
