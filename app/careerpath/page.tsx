import SubmitGuess from "./_components/SubmitGuess";
import { teams } from "@/components/Teams";
import ServerPlayerDisplay from "./_components/ServerPlayerDisplay";
import ServerTeamDisplay from "./_components/ServerTeamDisplay";
import { PeriodTypes } from "@/interfaces/Interfaces";
import { getPlayersByPeriod } from "@/controllers/PlayersController";

export default async function CareerPathPage(period: PeriodTypes) {
  const players = await getPlayersByPeriod(period);
  return (
    <div>
      <h1>Career path</h1>
      <div className="flex items-center gap-16">
        <ServerPlayerDisplay players={players} teams={teams} />
        <ServerTeamDisplay teams={teams} />
        <SubmitGuess />
      </div>
    </div>
  );
}
