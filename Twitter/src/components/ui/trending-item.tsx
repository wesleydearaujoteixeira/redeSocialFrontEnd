
type Props = {
    count: number;
    label: string;
}
export const TrendingItem = ({ count, label }: Props) => {
    return (
        <div
            className="group/item"
        >
            <div className="group-hover/item:underline font-bold"> {label} </div>
            <div className="text-sm text-gray-400">{count} posts </div>
        </div>
    );
}

export const TrendingItemSkeleton = () => {
    return (
        
        <div className="animate-pulse flex flex-col gap-1">
            <div className="bg-gray-600 w-3/4 h-4"></div>
            <div className="bg-gray-600 w-1/4 h-4"></div>
        </div>
    );
}