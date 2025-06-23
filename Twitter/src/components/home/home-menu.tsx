'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Logo } from "../ui/logo";
import { faBell, faHouse, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SearchInput } from "../ui/search-input";
import { NavItem } from "../nav/nav-item";
import { NavLogout } from "../nav/nav-logout";
import Link from "next/link";
import { removerAspas } from "@/app/removeAspas";
import { useEffect, useState } from "react";
import { Notificacao } from "@/types/twiterTypes";

type Props = {
    closeAction: () => void;
}
export const HomeMenu = ({ closeAction }: Props) => {




const [notification, setNotification] = useState<Notificacao[]>([]);



  useEffect(() => {

    const userId = localStorage.getItem('id-usuario');
    const token = localStorage.getItem('token-usuario');



    if(!userId || !token){
      console.log("Token incorreto, ou usuário incorreto");
      return;
    }


    const FetchNotifications = async () => {


      try {

        const response = await fetch(`https://rede-social-2.onrender.com/redes/notificando/usuario/${userId}`, {
          headers: {
            'Authorization': `Bearer ${removerAspas(String(token))}`,
            'Content-Type': 'application/json'
          }
        });
  
        const data = await response.json();
        console.log(data);
        setNotification(data);

      } catch (error) {
        console.log(error + " Error detectado!!! ");
      }

    }
    
    FetchNotifications();
  }, []);

    return (
        <div className="lg:hidden fixed inset-0 p-6 bg-black">
            <div className="flex justify-between items-center">
                <Logo size={32} />
                <div onClick={closeAction} className="cursor-pointer flex justify-center items-center size-12 rounded-full border-2 border-gray-900">
                    <FontAwesomeIcon icon={faXmark} className="size-6" />
                    
                </div>
            </div>

            <div className="my-6">
                <SearchInput />
            </div>

            <div>
                <NavItem
                    icon={faHouse}
                    label="Página inicial"
                />

                
                <Link href={`/edit`}>
                    <NavItem
                        icon={faUser}
                        label="Meu perfil"
                    />                
                </Link>
             
                <Link href="/notificacoes" className="relative">
                    <NavItem
                        icon={faBell}
                        label="Notificações"
                    />
                       {notification.length == 0 && (
                                <span className="absolute top-1 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {notification.length}
                                </span>

                            )}
                
                
                </Link>
                

                <NavLogout />
            </div>
        </div>
    );
}