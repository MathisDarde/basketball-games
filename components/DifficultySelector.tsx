export default function DifficultySelector({
  onSelect,
}: {
  onSelect: (difficulty: string) => void;
}) {
  const difficulties = ["easy", "medium", "hard"];

  return (
    <div className="p-4 flex flex-col gap-3">
      {difficulties.map((diff) => (
        <button
          key={diff}
          className="p-4 rounded-md bg-dark-purple text-white font-outfit"
          onClick={() => onSelect(diff)}
        >
          {diff.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
