"use client";

import { usePlayTogetherCtx } from "@/components/context";
import { GridThemes } from "@/components/GridThemes";
import Image from "next/image";

export default function NBAGrid() {
  const { getRandomGridThemes } = usePlayTogetherCtx();

  const themes = getRandomGridThemes({
    numberThemes: 6,
    themes: GridThemes,
  });

  const columnThemes = themes.slice(0, 3);
  const rowThemes = themes.slice(3, 6);

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-1 w-fit">
      {/* Coin vide (0,0) */}
      <div />

      {/* En-tête des colonnes */}
      {columnThemes.map((col, i) => (
        <div
          key={`col-${i}`}
          className="text-center flex flex-col gap-2 items-center justify-center size-32 font-bold p-2 border"
        >
          {col.imageUrl && (
            <Image src={col.imageUrl} width={50} height={50} alt="Team logo" />
          )}
          {col.label}
        </div>
      ))}

      {rowThemes.map((row, rowIndex) => (
        <>
          {/* En-tête de ligne */}
          <div
            key={`row-label-${rowIndex}`}
            className="text-center flex flex-col gap-2 items-center justify-center size-32 font-bold p-2 border"
          >
            {row.imageUrl && (
              <Image
                src={row.imageUrl}
                width={50}
                height={50}
                alt="Team logo"
              />
            )}
            {row.label}
          </div>

          {/* Cellules de la ligne */}
          {columnThemes.map((col, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="p-4 border text-center size-32 hover:bg-gray-100 cursor-pointer"
            ></div>
          ))}
        </>
      ))}
    </div>
  );
}
