"use client";

import Button from "@/components/CustomButton";
import { rarities } from "@/components/Rarity";
import { useState } from "react";

export default function HowDoesItWork() {
    const [chosenRarity, setChosenRarity] = useState("");

    const rarity = rarities.find((r) => r.name === chosenRarity);
    const higherRarity = rarity
        ? rarities.find((r) => r.level === rarity.level + 1)
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow max-w-[650px] w-full mx-auto space-y-4">
            <h2 className="text-xl sm:text-2xl font-medium text-center font-unbounded">
                How does the trade work?
            </h2>

            <p className="text-center text-base font-outfit text-gray-600">
                {chosenRarity === ""
                    ? "Choose a rarity to see the trade options"
                    : `${chosenRarity} selected`}
            </p>

            {chosenRarity === "" ? (
                <div className="grid grid-cols-3 place-items-center lg:flex items-center justify-center gap-4">
                    {rarities.map((rarity) => (
                        <div
                            key={rarity.name}
                            onClick={() => setChosenRarity(rarity.name)}
                            className={`w-[70px] md:w-[100px] h-[100px] md:h-[140px] bg-${rarity.color} border border-black rounded-md cursor-pointer hover:scale-105 transition-transform`}
                            title={rarity.name}
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Option 1 */}
                    <div className="p-4 rounded-lg shadow-md bg-gray-100">
                        <h3 className="font-medium font-unbounded text-base mb-2">Option 1</h3>
                        <p className="font-outfit text-left text-sm sm:text-base">
                            Exchange <strong>2</strong> cards of rarity{" "}
                            <span className={`text-${rarity?.color} font-bold`}>{chosenRarity}</span> to
                            get <strong>1</strong> card of the <strong>same rarity</strong>.
                        </p>

                        <div className="flex items-center justify-center gap-2 mt-3">
                            <div className={`w-[57px] sm:w-[100px] h-[80px] sm:h-[140px] rounded-sm bg-${rarity?.color} border`} />
                            <div className={`w-[57px] sm:w-[100px] h-[80px] sm:h-[140px] rounded-sm bg-${rarity?.color} border`} />
                            <span className="text-2xl font-bold">→</span>
                            <div className={`w-[57px] sm:w-[100px] h-[80px] sm:h-[140px] rounded-sm bg-${rarity?.color} border`} />
                        </div>
                    </div>

                    {/* Option 2 */}
                    <div className="p-4 rounded-lg shadow-md bg-gray-100">
                    <h3 className="font-medium font-unbounded text-base mb-2">Option 2</h3>
                        {higherRarity ? (
                            <>
                                <p className="font-outfit text-left text-sm sm:text-base">
                                    Exchange{" "}
                                    <strong>{rarity?.needToUpgrade}</strong> cards of rarity{" "}
                                    <span className={`text-${rarity?.color} font-bold`}>{chosenRarity}</span> to get{" "}
                                    <strong>1</strong> card of rarity{" "}
                                    <span className={`text-${higherRarity.color} font-bold`}>{higherRarity.name}</span>.
                                </p>

                                <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                                    {rarity?.needToUpgrade && rarity.needToUpgrade > 6 ? (
                                        <div className="flex items-center gap-2">
                                            <div className={`w-[57px] sm:w-[100px] h-[80px] sm:h-[140px] rounded-sm bg-${rarity.color} border`} />
                                            <span className="text-xl sm:text-2xl font-semibold font-unbounded">× {rarity.needToUpgrade}</span>
                                        </div>
                                    ) : (
                                        Array.from({ length: rarity?.needToUpgrade || 0 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-[57px] sm:w-[100px] h-[80px] sm:h-[140px] rounded-sm bg-${rarity?.color} border`}
                                            />
                                        ))
                                    )}

                                    <span className="text-2xl font-bold">→</span>
                                    <div
                                        className={`w-[57px] sm:w-[100px] h-[80px] sm:h-[140px] rounded-sm bg-${higherRarity?.color} border`}
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 italic font-outfit">
                                This rarity cannot be upgraded further.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={() => setChosenRarity("")}
                            size="default"
                            theme="secondary"
                        >
                            Choose another rarity
                        </Button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}
