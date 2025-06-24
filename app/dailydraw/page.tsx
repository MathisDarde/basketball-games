"use client";

import { PlayerData, usePlayTogetherCtx } from "@/components/context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import storeCardInCollection from "@/actions/cardcollection/addcardtocollection";

export default function DailyDraw() {
  const { getRandomPlayers, players, getUserId } = usePlayTogetherCtx();
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [revealAll, setRevealAll] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Récupérer l'ID utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUser();
  }, [getUserId]);

  // Tirer les cartes
  useEffect(() => {
    if (players.length > 0) {
      const result = getRandomPlayers({ numberPlayers: 25, players });
      setSelectedPlayers(result);
    }
  }, [players, getRandomPlayers]);

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || flipped.length >= 5 || revealAll) return;

    const updatedFlipped = [...flipped, index];
    setFlipped(updatedFlipped);

    if (updatedFlipped.length === 5) {
      setTimeout(() => {
        setRevealAll(true);
      }, 1500);
    }
  };

  const handleRedirectAndStore = async () => {
    if (!userId) return;

    const flippedPlayers = flipped.map((index) => selectedPlayers[index]);

    for (const player of flippedPlayers) {
      await storeCardInCollection(player.id, userId);
    }

    router.push("/nbacollection");
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Daily Draw</h1>

      <div className="grid grid-cols-5 grid-rows-5 gap-2">
        {selectedPlayers.map((player, index) => {
          const isFlipped = flipped.includes(index) || revealAll;
          const { name, image_link } = player;

          return (
            <div
              key={index}
              className="relative w-24 h-32 cursor-pointer border rounded overflow-hidden"
              onClick={() => handleCardClick(index)}
            >
              {!isFlipped ? (
                <Image
                  src="/cardback.png"
                  alt="Back of the card"
                  width={96}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Image
                    src={image_link}
                    fill
                    alt="Player image"
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white text-xs text-center px-1 py-0.5">
                    {name}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {revealAll && (
        <div className="mt-6 text-center">
          <button
            onClick={handleRedirectAndStore}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded mt-4"
          >
            Voir ma collection
          </button>
        </div>
      )}
    </>
  );
}
