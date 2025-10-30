import { ShoppingBasket, UsersRound } from "lucide-react";
import Link from "next/link";

export default async function TradeCardPage({ params } : { params: { period: string }}) {
    const period = params.period;

    return (
        <div className="p-6">
            <h1 className="font-unbounded text-center text-2xl mb-4">Trade Center</h1>

            <div className="flex flex-col gap-4">
                <Link href={`/nbacollection/trade/online`}>
                <div className="w-full flex flex-col items-center gap-2 p-4 bg-dark-purple text-white rounded-md">
                    <UsersRound />
                    <p className="font-unbounded">Trade with other players</p>
                    <p className="text-sm font-outfit">Exchange cards with your friends to complete your collection</p>
                </div>
                </Link>

                <Link href={`/nbacollection/trade/marketplace`}>
                <div className="w-full flex flex-col items-center gap-2 p-4 bg-accent-brown text-white rounded-md">
                    <ShoppingBasket />
                    <p className="font-unbounded">Marketplace</p>
                    <p className="text-sm font-outfit">Discover the marketplace and trade duplicates to improve and grow your collection</p>
                </div>
                </Link>
            </div>
        </div>
    )
}