'use client'
import { RecommendationItem, RecommendationItemSkeleton } from "./recommendation-item";
import { useEffect, useState } from "react";
import { User } from "@/types/twiterTypes";
import { removerAspas } from "@/app/removeAspas";

export const RecommendationArea = () => {

        const [user, setUser] = useState<User[]>([]);
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
                        const response = await fetch(`https://rede-social-2.onrender.com/redes/sugestoes/${userId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'Application/json',
                                'Authorization': `Bearer ${removerAspas(String(tk))}`
                            },
                        });
    
                        if (!response.ok) {
                            console.error(`Erro HTTP ${response.status}`);
                            return;
                        }
    
                        const data = await response.json();
                        setUser(data);
                    } catch (err) {
                        console.error('Erro na requisição:', err);
                    }
                };
                fetchUser();
            }
        }, [tk, userId]);
    return (
        <div className="bg-gray-700 rounded-3xl  h-[400px] lg:h-[400px] ">
            <h2 className="text-xl p-3">Quem seguir</h2>
            <div className="flex-col">
                {user && user.map((usuario) => {
                return (
                    <div key={usuario.id}>
                        <div className="flex flex-col gap-4 p-6 pt-0" >
                            {user && <RecommendationItem user={usuario} /> }
                        </div>
                    
                    </div>
                )
            })}
            </div>
        </div>
    );
}