'use client'
import { removerAspas } from "@/app/removeAspas";
import { User } from "@/types/twiterTypes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const NavMyProfile = () => {


    const [user, setUser] = useState<User>();
    const [tk, setTk] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);    

 useEffect(() => {
        const token = localStorage.getItem("token-usuario");
        const id = localStorage.getItem("id-usuario");
            
        
            if (!token || !id) return;
        
            setTk(token);
            setUserId(id);
        }, []);
        
        // Carregar informações do usuário
        useEffect(() => {
            if (tk && userId !== null) {
                const fetchUser = async () => {
                    if (!tk || userId === null) return;
    
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/user/${userId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'Application/json',
                                'Authorization': `Bearer ${removerAspas(String(tk))}`
                            },
                        });
    
                        if (!response.ok) {
                            return;
                        }
    
                        const data = await response.json();
                        setUser(data);
                    } catch (err) {
                    }
                };
                fetchUser();
            }
        }, [tk, userId]);



    return (
        <div className="flex items-center">
            <div className="size-10 mr-2 rounded-full overflow-hidden">
                <Link href={`/${user?.nome}`}>
                   {user &&  <Image
                        src={user?.imagemPerfilUrl}
                        alt={user?.nome}
                        width={100}
                        height={100}
                        className="size-full"
                    />}
                </Link>
            </div>
            <div className="flex-1 overflow-hidden">
                <Link href={`/${user?.nome}`} >
                    {user?.nome}
                </Link>
                <div className="text-sm text-gray-400"> @{user?.link} </div>
            </div>
        </div>
    );
}