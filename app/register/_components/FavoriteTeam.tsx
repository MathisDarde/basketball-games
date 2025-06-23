"use client";

import { usePlayTogetherCtx } from "@/components/context";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { RegisterSchemaType } from "@/types/forms";
import { ImageIcon } from "lucide-react";

type FavoriteTeamSelectProps = {
  register: UseFormRegister<RegisterSchemaType>;
  setValue: UseFormSetValue<RegisterSchemaType>;
};

export default function FavoriteTeamSelect({
  register,
  setValue,
}: FavoriteTeamSelectProps) {
  const { teams } = usePlayTogetherCtx();

  const handleSelect = (team: string) => {
    setValue("favorite_team", team);
  };

  return (
    <div className="relative w-[600px] z-10">
      <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
        <ImageIcon className="mr-4" />
        Favorite Team :
      </span>
      <select className="w-full border border-gray-400 rounded-full px-6 py-4 bg-white cursor-pointer flex items-center justify-between">
        {teams.map((team, index) => {
          return (
            <option
              key={index}
              {...register("favorite_team")}
              onClick={() => handleSelect(team)}
              className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {team}
            </option>
          );
        })}
      </select>
    </div>
  );
}
