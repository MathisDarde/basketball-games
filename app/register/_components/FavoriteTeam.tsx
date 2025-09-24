import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { RegisterSchemaType } from "@/types/forms";
import { ImageIcon } from "lucide-react";
import { TeamsData } from "@/components/Teams";

type FavoriteTeamSelectProps = {
  register: UseFormRegister<RegisterSchemaType>;
  setValue: UseFormSetValue<RegisterSchemaType>;
};

export default function FavoriteTeamSelect({
  register,
  setValue,
}: FavoriteTeamSelectProps) {
  const handleSelect = (team: string) => {
    setValue("favorite_team", team);
  };

  return (
    <div className="relative w-full xl:w-[600px] space-y-2">
      <span className="font-outfit text-black flex items-center">
        <ImageIcon size={18} className="mr-2" />
        Favorite Team :
      </span>
      <select className="w-full xl:w-[600px] border border-accent-brown rounded px-4 py-3 bg-white cursor-pointer flex items-center justify-between shadow font-outfit text-sm">
        {[...TeamsData]
          .sort((a, b) => a.currentName.localeCompare(b.currentName))
          .map((team, index) => (
            <option
              key={index}
              {...register("favorite_team")}
              onClick={() => handleSelect(team.currentName)}
              className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {team.currentName}
            </option>
          ))}
      </select>
    </div>
  );
}
