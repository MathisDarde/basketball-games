const TEAM_CITY_WORDS = [
  "Portland",
  "Golden",
  "State",
  "Los",
  "Angeles",
  "New",
  "York",
  "Chicago",
  "Miami",
  "Cleveland",
  "Boston",
  "Dallas",
  "Houston",
  "Phoenix",
  "Denver",
  "San",
  "Antonio",
  "Sacramento",
  "Utah",
  "Minnesota",
  "Brooklyn",
  "Toronto",
  "Orlando",
  "Milwaukee",
  "Atlanta",
  "Detroit",
  "Washington",
  "Philadelphia",
  "Oklahoma",
  "City",
  "Memphis",
  "Indiana",
  "Charlotte",
  "New",
  "Orleans",
  "Seattle",
  "Jersey"
];

// Fonction utilitaire pour simplifier le nom de l’équipe
export default function simplifyTeamName(team: string): string {
  const words = team.split(" ");
  // Filtrer les mots "ville"
  const filtered = words.filter((w) => !TEAM_CITY_WORDS.includes(w));
  // Si tout a été filtré (rare), on garde le dernier mot original
  return filtered.length > 0 ? filtered.join(" ") : words[words.length - 1];
}