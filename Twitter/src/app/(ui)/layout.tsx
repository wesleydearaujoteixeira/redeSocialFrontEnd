'use client'

import { NavItem } from "@/components/nav/nav-item";
import { NavLogout } from "@/components/nav/nav-logout";
import { NavMyProfile } from "@/components/nav/nav-myprofile";
import { Logo } from "@/components/ui/logo";
import { RecommendationArea } from "@/components/ui/recommendation-area";
import { SearchInput } from "@/components/ui/search-input";
import { TrendingArea } from "@/components/ui/trending-area";
import { faBell, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { removerAspas } from "../removeAspas";
import { Notificacao } from "@/types/twiterTypes";

type Props = {
    children: ReactNode;
}
export default function Layout({ children }: Props) {


      const [notification, setNotification] = useState<Notificacao[]>([]);


      const [idUser, setUserId] = useState<string>();


    


    
    useEffect(() => {
    
        const userId = localStorage.getItem('id-usuario');
        const token = localStorage.getItem('token-usuario');
    
    
    
        if(!userId || !token){
          console.log("Token incorreto, ou usuário incorreto");
          return;
        }
        setUserId(userId);
    
    
        const FetchNotifications = async () => {
    
    
          try {
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/notificando/usuario/${userId}`, {
              headers: {
                'Authorization': `Bearer ${removerAspas(String(token))}`,
                'Content-Type': 'application/json'
              }
            });
      
            const data = await response.json();
            setNotification(data);
    
          } catch (error) {
          }
    
        }
        
        FetchNotifications();
      }, []);
    
    
    
    return (
        <main className="min-h-screen flex justify-center mx-auto max-w-7xl">
            <section className="hidden lg:flex flex-col sticky top-0 h-screen w-72 px-3 border-r-2 border-gray-900">
                <div className="flex-1 mt-6">
                    <Logo size={24} />
                    <nav className="mt-11">

                        <Link href="/home">
                            <NavItem
                                icon={faHouse}
                                label="Página inicial"
                            />
                        </Link>

                        <Link href={`/usuarios/${idUser}`}>
                            <NavItem
                                icon={faUser}
                                label="Meu perfilll"
                            />
                        </Link>



                        <Link href="/notificacoes" className="relative flex items-center">
                        
                        <NavItem icon={faBell} label="Notificações" />
                        
                            {notification.length > 0 && (
                                <span className="absolute top-1 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {notification.length}
                                </span>

                            )}

                        </Link>

                        
                        
                    </nav>
                </div>
                <div className="mb-6 flex flex-col gap-4">
                    <NavLogout />
                    <NavMyProfile />
                </div>
            </section>
            <section className="flex-1 max-w-lg">
                {children}
            </section>
            <aside className="hidden lg:flex flex-col gap-6 sticky top-0 h-fit w-96 px-8 py-6 border-l-2 border-gray-900">
                <SearchInput hideOnSearch />
                <TrendingArea />
                <RecommendationArea />
            </aside>
        </main>
    );
}