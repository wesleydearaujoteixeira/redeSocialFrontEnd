'use client'
import { TweetItem } from "../tweet/tweet-item";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const HomeFeed = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem('token-usuario');

        if (id) {
            setUserId(id);
        } else {
            router.replace('/signin');
        }

        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

        )
            
    }

    return (
        <>
            <TweetItem/>        
        </>
    );
};
