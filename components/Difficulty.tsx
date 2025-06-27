import { usePlayTogetherCtx } from "./context";

export default function Difficulty() {
  const { setDifficulty, streakCount } = usePlayTogetherCtx();

  return (
    <div className="flex justify-between items-center">
      <select
        name="difficulty"
        onChange={(e) => setDifficulty(Number(e.target.value))}
      >
        <option value="0" defaultChecked>
          Easy
        </option>
        <option value="1">Medium</option>
        <option value="2">Hard</option>
      </select>

      <p>Streak : {streakCount}</p>
    </div>
  );
}
