export default function DifficultySelector({
  onSelect,
}: {
  onSelect: (difficulty: string) => void;
}) {
  const difficulties = ["easy", "medium", "hard"];

  return (
    <div className="p-4 max-w-[600px] mx-auto">
    <div className="flex gap-4 flex-col w-full">
      {difficulties.map((diff) => (
        <button
          key={diff}
          className="cursor-pointer p-4 rounded-md bg-dark-purple text-white flex items-center justify-center gap-2 w-full font-outfit md:text-lg 2xl:text-xl"
          onClick={() => onSelect(diff)}
        >
          {diff.toUpperCase()}
        </button>
      ))}
    </div>
    </div>
  );
}
