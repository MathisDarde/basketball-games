import { getPlayers } from "@/controllers/PlayersController";
import { getUserId } from "@/utils/get-user-id";
import { getLastStreak } from "@/controllers/PlayTogetherSessionsController";
import { PeriodTypes } from "@/interfaces/Interfaces";
import PlayTogetherWrapper from "../_components/PlayTogetherWrapper";

export default async function PlayTogetherPeriodPage(props: {
  params: Promise<{ period: PeriodTypes }>;
}) {
  const { period } = await props.params;
  const players = await getPlayers(period);
  const userId = await getUserId();
  const lastStreak = await getLastStreak(userId, period);

  return (
    <PlayTogetherWrapper
      players={players}
      userId={userId}
      lastStreak={lastStreak}
      period={period}
    />
  );
}
