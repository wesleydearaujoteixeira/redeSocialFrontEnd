import { HomeFeed } from "@/components/home/home-feed";
import { HomeHeader } from "@/components/home/home-header";
import { TweetPost } from "@/components/tweet/tweet-post";
import { RecommendationArea } from "@/components/ui/recommendation-area";

export default function Page() {
    return (
        <div>
            <HomeHeader />
            <TweetPost />
            <HomeFeed />
            <div className="block md:hidden mt-5">
                <RecommendationArea />
            </div>
        </div>
    );
}