"use server";

import { PeriodTypes } from "@/interfaces/Interfaces";
import { getPlayersByPeriod } from "@/controllers/PlayersController";
import CareerPathComponentWrapper from "../_components/ComponentWrapper";
import { getAuthenticatedUserId } from "@/actions/user/get-connected-user-id";
import { getLastStreak } from "@/controllers/CareerPathSessionsController";

export default async function CareerPathPage({
  params,
  searchParams,
}: {
  params: { period: PeriodTypes };
  searchParams: { difficulty?: string };
}) {
  const players = await getPlayersByPeriod(params.period);

  const { difficulty = "normal" } = searchParams;

  const userId = await getAuthenticatedUserId();

  const lastStreak = await getLastStreak(userId, params.period);

  return (
    <div className="p-6 sm:p-10">
      <h1>Career path</h1>
      <CareerPathComponentWrapper
        players={players}
        difficulty={difficulty}
        period={params.period}
        userId={userId}
        lastStreak={lastStreak}
      />
    </div>
  );
}
