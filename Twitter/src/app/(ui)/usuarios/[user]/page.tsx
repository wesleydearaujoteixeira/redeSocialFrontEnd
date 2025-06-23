'use client'
import { removerAspas } from '@/app/removeAspas'
import { Button } from '@/components/ui/button'
import { GeneralHeader } from '@/components/ui/general-header'
import { Perfil, Post, User } from '@/types/twiterTypes'
import { faComment, faLink} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, {useEffect, useState } from 'react'

export default function Page() {


        const [user, setUser] = useState<User>();
        const params = useParams();
        const id = params.user; 

        const [posts, setPosts] = useState<Post[]>([]);
        const [seguidores, setSeguidores] = useState<Perfil[]>([]);



        useEffect(() => {

                if(!id) return;

                const tk = localStorage.getItem('token-usuario');
                const userId = localStorage.getItem('id-usuario');

                    if (tk && userId !== null) {
                        const fetchUser = async () => {
                            if (!tk || userId === null) return;
            
                            try {
                                const response = await fetch(`https://rede-social-2.onrender.com/redes/user/${id}`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${removerAspas(tk)}`
                                    },
                                });

                            
            
                                if (!response.ok) {
                                    console.error(`Erro HTTP ah pór favor né  ${response.status}`);
                                    return;
                                }
            
                                const data = await response.json();
                                console.log(data);
                                setUser(data);
                            } catch (err) {
                                console.error('Erro na requisição:', err);
                                
                            }


                            try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/posts/usuario/${id}`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${removerAspas(tk)}`
                                    },
                                });

                            
            
                                if (!response.ok) {
                                    console.error(`Erro HTTP ah pór favor né  ${response.status}`);
                                    return;
                                }
            
                                const data = await response.json();
                                console.log(data);
                                setPosts(data);
                            } catch (error) {
                            }

                            try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/seguidores/${id}`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${removerAspas(tk)}`
                                    },
                                });

                            
            
                                if (!response.ok) {
                                    return;
                                }
            
                                const data = await response.json();
                                setSeguidores(data);
                            } catch (error) {
                            }

                            
                        
    
                        };
                        fetchUser();
                    }
                }, []);
    

                const FollowButton = async () => {



                    const userId = localStorage.getItem('id-usuario');
                    const token = localStorage.getItem('token-usuario');

                
                    if (!userId || !token) {
                        return;
                    }
                                
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/seguir/${userId}/${id}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${removerAspas(String(token))}`,
                            },
                        });
                
                        if (response.ok) {
                            alert(`Você esta seguindo esse usuário `);

                            const data = await response.text();
                            location.reload();

                        } else {
                        }
                    } catch (error) {
                        console.error('Houve algum erro:', error);
                    }
                };

                const unFollowButton = async () => {



                    const userId = localStorage.getItem('id-usuario');
                    const token = localStorage.getItem('token-usuario');

                    console.log("Token enviado:", removerAspas(String(token)));
                
                    if (!userId || !token) {
                        return;
                    }
                                
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/unfollow/${userId}/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${removerAspas(String(token))}`,
                            },
                        });
                
                        if (response.ok) {
                            alert(` Você deixou de seguir esse usuário `);

                            const data = await response.text();
                            console.log(data);
                            location.reload();

                        } else {
                            console.error('Falha ao atualizar status de seguir:', response.status);
                        }
                    } catch (error) {
                        console.error('Houve algum erro:', error);
                    }
                };
    
  return (
        <div>
        <GeneralHeader backHref="/">
        <div className="font-bold text-lg"> </div>
        <div className="text-xs text-gray-500"> {user?.totalPosts} posts </div>
    </GeneralHeader>
    <section className="border-b-2 border-gray-900">
       {user &&  
        <> 
       <div className="bg-gray-500 h-[100px] bg-no-repeat bg-cover bg-center">

            <img
                src={user.perfilBackground}
                alt={user.nome}
                className="h-[auto]"
            />      
        </div>
        <div className="-mt-12 flex justify-between items-end px-6">
            <img
                src={user.imagemPerfilUrl}
                alt={user.nome}
                className="size-24 rounded-full w-24 h-24 rounded-full object-cover"
            />

            <div className=' flex flex-col gap-3'>
            <div className="w-32">
                <Button label={"Seguir"} size={2} onClick={FollowButton} />                           
            </div>
            <div className="w-32">
                <Button label="onfollow" size={2} onClick={unFollowButton} />                           
            </div>
            </div>

        </div>
        </>
        }
        
        {user &&  
        
        <div className="px-6 mt-4">
            <div className="text-xl font-bold text-white">{user.nome}</div>
            <div className="py-5 text-lg text-white "> {user.bio} </div>
                <div className="flex gap-2 items-center">
                    <FontAwesomeIcon icon={faLink} className="size-5" />
                    <Link href={user.nome} target="_blank" className="text-blue-300"> {user.link} </Link>
                </div>
                <div className="my-5 flex gap-6">
                        <div className="text-xl text-gray-500"><span className="text-white"> {seguidores && seguidores.length} </span> Seguidor(es) </div>
                    </div>
        </div>
        }

    </section>
        <div className="p-6 border-b-2 border-gray-900">

              {posts && posts.length > 0 && posts.map((post) => (
                     <div key={post.id} className="mt-8">
                     <div className="space-y-4">
                         <div  className="p-4 bg-gray-800 rounded-lg">
                             <div className="flex items-center flex-col gap-3 text-sm text-white font-bold mb-1">
                                 <div className="text-white  gap-5">
                                     <div className="flex items-center gap-3">
                                         <Image
                                            src={post.usuario.imagemPerfilUrl}
                                            alt={post.usuario.nome}
                                            height={10}
                                            width={40}
                                            priority
                                            className='rounded-full'

                                         />

                                         <h2 className="text-yellow-300"> {post.usuario.nome} </h2> 
     
                                     </div> 
                                 <div className="mt-4 text-white break-words w-full max-w-full">
                                     {post.conteudo} sdsds
                                 </div>
                             </div>
                                 <Image
                                    src={post.imagemUrl}
                                    alt={post.usuario.nome}
                                    height={400}
                                    width={400}
                                    />
                            </div>
                    <div className="flex items-center justify-center mt-4 text-gray-500 w-[50%] mx-auto">
                        <div className="flex-1">
                      <Link href={`/tweet/${post.id}`}>
                        <div className="inline-flex items-center gap-2 cursor-pointer">
                          <FontAwesomeIcon icon={faComment} className="size-6" />
                          <span className="text-lg"> {post.totalComentarios} </span>
                        </div>
                      </Link>
                    </div>
                  <div className="flex-1">
                    <div
                      className={`inline-flex items-center gap-2 cursor-pointer`}>
                      <FontAwesomeIcon
                        icon={faHeartFilled}
                        className="size-6 text-red"
                      />
                      <span className="text-lg"> {post.totaldeLikes} </span>
                    </div>
                  </div>
                </div>
                </div>
            </div>         
            </div>
              ))}

        </div>
        </div>
        )

}
