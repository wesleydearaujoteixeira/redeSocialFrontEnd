"use client"

import { User } from "@/types/twiterTypes";
import Link from "next/link";
import { Button } from "./button";
import { useState } from "react";
import { removerAspas } from "@/app/removeAspas";

type Props = {
    user: User;
}

export const RecommendationItem = ({ user }: Props) => {
    const [following, setFollowing] = useState(false);

    const handleFollowButton = async (id: number) => {
        setFollowing(true);

        const userId = localStorage.getItem('id-usuario');
        const token = localStorage.getItem('token-usuario');

        if(!userId || !token){
            console.log("Não veio a porra do token e do id user");
            return;
        }


        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/seguir/${userId}/${id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${removerAspas(String(token))}`
                }
            });

            const data = await response.status;
            console.log(data);
            
            if(user.id == id){
                alert(" Você seguiu o usuário " + user.nome);
            }

            location.reload();

            
        } catch (error) {
            console.log(error, " erro ai na requisição");
        }


    }

    return (
        <div className="flex items-center">
            <div className="size-10 mr-2 rounded-full overflow-hidden">
                <Link href={`/usuarios/${user.id}`}>
                    <img
                        src={user.imagemPerfilUrl}
                        alt={user.nome}
                        className="size-full"
                    />
                </Link>
            </div>
            <div className="flex-1 overflow-hidden">
                <Link href={`/usuarios/${user.id}`} className="block truncate">{user.nome} </Link>
                <div className="truncate text-sm text-gray-400">@{user.link ? user.link : user.nome}  </div>
            </div>
            <div className="pl-2 w-20">
                {!following &&
                    <Button
                        label="Seguir"
                        onClick={() => handleFollowButton(user.id) }
                        size={3}
                    />
                }
            </div>
        </div>
    );
}

export const RecommendationItemSkeleton = () => {
    return (
        <div className="animate-pulse flex items-center">
            <div className="size-10 mr-2 rounded-full bg-gray-600"></div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="bg-gray-600 w-3/4 h-4"></div>
                <div className="bg-gray-600 w-1/4 h-4"></div>
            </div>
        </div>
    );
}