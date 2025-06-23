'use client'
import { removerAspas } from "@/app/removeAspas";
import { GeneralHeader } from "@/components/ui/general-header";
import { Notificacao } from "@/types/twiterTypes";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"

const page = () => {

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

        const response = await fetch(`https://rede-social-1vg1.onrender.com/redes/notificando/usuario/${userId}`, {
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


  const ReadNotification = async (id: number) => {

    const token = localStorage.getItem('token-usuario');


    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/marcarlida/${id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${removerAspas(String(token))}`
        }
      });
      

      const data = await response.status
      location.reload();

    } catch (error) {
        console.log(error + " não foi possivel prosseguir com a notificação! ");      
    }

  }

  return (
    <div className="flex flex-col">
        
        <GeneralHeader backHref="/">
                      <div className="font-bold text-lg"> Voltar </div>
        </GeneralHeader>
       
        {notification && notification.length > 0 && notification.map((noti) => {
          return (
            <div key={noti.id} onClick={() => ReadNotification(noti.id)}>
              <Link href={`/tweet/${noti.comentario.post.id}`}>
              <div  className="mt-5 flex items-center gap-3">
                  <Image
                      src={`${noti.comentario.usuario.imagemPerfilUrl}`}
                      alt={noti.comentario.usuario.nome}
                      height={50}
                      width={50}
                      className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span> {noti.mensagem} </span>
                    <span className="text-[10px] text-yellow-500"> {noti.dataCriacao} </span>
                  </div>
              </div>
              </Link>
              <hr className="mt-3"/>
            </div>
          )
        })}

        {!notification || notification.length <= 0 && <>

            <div>  Você não possui notificações  </div>
        
        </>}


    </div>
  )
}

export default page
