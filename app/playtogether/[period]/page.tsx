import { getPlayersByPeriod } from "@/controllers/PlayersController";
import { getUserId } from "@/utils/get-user-id";
import { getLastStreak } from "@/controllers/PlayTogetherSessionsController";
import { PeriodTypes } from "@/interfaces/Interfaces";
import PlayTogetherWrapper from "../_components/PlayTogetherWrapper";

export default async function PlayTogetherPeriodPage(props: {
  params: { period: PeriodTypes };
  searchParams: { difficulty?: string };
}) {
  const { period } = props.params;
  const { difficulty = "normal" } = props.searchParams;

  const players = await getPlayersByPeriod(period);
  const userId = await getUserId();
  const lastStreak = await getLastStreak(userId, period);

  return (
    <PlayTogetherWrapper
      players={players}
      userId={userId}
      lastStreak={lastStreak}
      period={period}
      difficulty={difficulty}
    />
  );
}
