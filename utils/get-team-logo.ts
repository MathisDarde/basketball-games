import { TeamsData } from "@/components/Teams";

export const getTeamLogo = (teamName: string, year: number): string | undefined => {
    const franchise = TeamsData.find((t) => t.names.includes(teamName));
    if (!franchise) return undefined;

    const periodMatch = franchise.periods.find((p) => {
      const normalized = p.period.replace("–", "-").toLowerCase();
      const [from, to] = normalized.split("-").map((x) => x.trim());

      const fromYear = Number(from);
      const toYear = to === "present" ? new Date().getFullYear() : Number(to);

      return year >= fromYear && year <= toYear;
    });

    return periodMatch?.logo;
  };