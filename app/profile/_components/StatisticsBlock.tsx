"use client"

export default function StatisticsBlock({ PTHighestStreak, totalPlayTogetherGames, totalCards, totalPlayers }: { PTHighestStreak: number, totalPlayTogetherGames: number, totalCards: number, totalPlayers: number }) {
    return (
        <div className="my-2">
            <p className="underline text-center font-outfit text-sm">Play together</p>
            <div className="flex items-center justify-center gap-2">
                <div className="text-center p-3 rounded-sm">
                    <p className="font-outfit text-sm">Highest streak</p>
                    <p className="font-unbounded text-3xl">{PTHighestStreak}</p>
                </div>
                <div className="text-center p-3 rounded-sm">
                    <p className="font-outfit text-sm">Amount of games</p>
                    <p className="font-unbounded text-3xl">{totalPlayTogetherGames}</p>
                </div>
            </div>
            <p className="underline text-center font-outfit text-sm">NBA Collection</p>
            <div className="flex items-center justify-center gap-2">
                <div className="text-center p-3 rounded-sm">
                    <p className="font-outfit text-sm">Total Cards</p>
                    <p className="font-unbounded text-3xl">{totalCards}<span className="text-sm">/ {totalPlayers}</span></p>
                </div>
            </div>
        </div>
    )
}