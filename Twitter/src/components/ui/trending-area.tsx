import { TrendingItem, TrendingItemSkeleton } from "./trending-item";

export const TrendingArea = () => {
    return (
        <div className="bg-gray-700 rounded-3xl">
            <h2 className="text-xl p-6">O que está acontecendo</h2>
            <div className="flex flex-col gap-4 p-6 pt-0">
                <TrendingItem label="Elon Musk SpaceX" count={2300} />
                <TrendingItem label="Política" count={6400} />
                <TrendingItem label="Entretenimento" count={8900} />
                <TrendingItem label="Esportes" count={130090} />
                <TrendingItemSkeleton />
                <TrendingItemSkeleton />
            </div>
        </div>
    );
}