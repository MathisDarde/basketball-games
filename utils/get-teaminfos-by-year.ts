export default function getTeamInfosByYear(
    periods: { period: string; abr: string; logo: string, mainColor: string, accentColor: string }[],
    year: number
  ): { period: string; abr: string; logo: string; mainColor: string; accentColor: string } | null {
    if (!Array.isArray(periods)) return null;

    const parsePeriod = (periodStr: string): [number, number] => {
      const match = periodStr.match(/(\d{4})[–-](\d{4}|present)/);
      if (!match) return [0, 0];
      const start = parseInt(match[1], 10);
      const end = match[2] === "present" ? new Date().getFullYear() : parseInt(match[2], 10);
      return [start, end];
    };

    const found = periods.find((p) => {
      const [start, end] = parsePeriod(p.period);
      return year >= start && year <= end;
    });

    return found || null;
  }