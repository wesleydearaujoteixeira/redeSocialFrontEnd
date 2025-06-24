'use client'
import { removerAspas } from "@/app/removeAspas";
import { ProfileFeed } from "@/components/profile/profile-feed";
import { Button } from "@/components/ui/button";
import { GeneralHeader } from "@/components/ui/general-header";
import { Post, User } from "@/types/twiterTypes";
import { faComment, faLink, faRetweet, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Page() {

        const [user, setUser] = useState<User>();
        const [tk, setTk] = useState<string | null>(null);
        const [userId, setUserId] = useState<string | null>(null);
        const [posts, setPosts] = useState<Post[]>([])
        
        
        const [seguindo, setSeguidores] = useState([]);
        const [seguidores, setSeguidos] = useState([]);
        const [view, setView] = useState<boolean>(false);

        const ViewPosts = () => {
            setView(!view);
        }


        const deletePost = async (id: number) => {

            const userId = localStorage.getItem("id-usuario");
            const token = localStorage.getItem("token-usuario");

           const deletar = confirm("Deseja mesmo deletar esse post?");


           if(deletar){
            try {
                
                const response = await fetch(`https://rede-social-2.onrender.com/redes/delete/post/${id}/${userId}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${removerAspas(String(token))}`
                    }
                });

                    if(response.status == 200){
                        const data = await response.status;
                        console.log(data);
                        alert("Deletando post...");
                        location.reload();
                    }else{
                        console.log(" houve algo estranho");
                    }

            } catch (error) {
                console.log("Houve algo estranho! ")
            }
           }
        }

    
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
                                        const response = await fetch(`https://rede-social-2.onrender.com/redes/posts/usuario/${userId}`, {
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
                                                        setPosts(data);
                                                    } catch (error) {
                                                        console.log(error, " Houve um erro ai na requisição... ")
                                                    }
        
                        try {
                            const response = await fetch(`https://rede-social-2.onrender.com/redes/user/${userId}`, {
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
                        const res = await fetch(`https://rede-social-2.onrender.com/redes/seguindo/${userId}`, {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${removerAspas(tk)}`
                            }
                          });
                    
                          if (!res.ok) {
                            console.error(`Erro Http: ${res.status}`);
                            return;
                          }
                    
                          const data = await res.json();
                          setSeguidores(data);
                       } catch (error) {
                            console.log(error);
                       }


                       try {
                        const res = await fetch(`https://rede-social-2.onrender.com/redes/seguidores/${userId}`, {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${removerAspas(tk)}`
                            }
                          });
                    
                          if (!res.ok) {
                            console.error(`Erro Http: ${res.status}`);
                            return;
                          }
                    
                          const data = await res.json();
                          setSeguidos(data);
                       } catch (error) {
                            console.log(error);
                       }
                    

                    };
                    fetchUser();
                }
            }, [tk, userId]);            
              

    return (
        <div>
            <>
                <GeneralHeader backHref="/">
                <div className="font-bold text-lg"> </div>
                <div className="text-xs text-gray-500"> {user?.totalPosts} posts </div>
            </GeneralHeader>
            <section className="border-b-2 border-gray-900">
                <div className="bg-gray-500 h-[100px] bg-no-repeat bg-cover bg-center">
                    <img
                        src={ user && user.perfilBackground}
                        alt={ user && user.nome}
                        className="h-[auto]"
                    />      
                </div>
                <div className="-mt-12 flex justify-between items-end px-6">
                    <img
                        src={ user && user.imagemPerfilUrl}
                        alt={ user && user.nome}
                        className="size-24 rounded-full w-24 h-24 rounded-full object-cover"
                    />
                    <div className="w-32">

                            {user && 
                            <Link href={`/edit`}>
                                <Button label="Editar Perfil" size={2} />
                            </Link> }
                                                   
                    </div>
                </div>
                    {user &&   
                    
                    <div className="px-6 mt-4">
                    <div className="text-xl font-bold text-white">{user.nome}</div>
                    <div className="py-5 text-lg text-white "> {user.bio} </div>
                        <div className="flex gap-2 items-center">
                            <FontAwesomeIcon icon={faLink} className="size-5" />
                            <Link href={user.email} target="_blank" className="text-blue-300">{user.link}</Link>
                        </div>
                    
                    <div className="my-5 flex gap-6">
                        <div className="text-xl text-gray-500"><span className="text-white"> {seguindo.length} </span> Seguindo </div>
                        <div className="text-xl text-gray-500"><span className="text-white"> {seguidores.length} </span> Seguidores</div>
                    </div>
                </div>}
            </section>
            </>
            <div>
            <div>
        <div className="p-6 border-b-2 border-gray-900">

              {posts && posts.length > 0 && posts.map((post) => (
                     <div key={post.id} className="mt-8">
                     <div className="space-y-4">
                         <div  className="p-4 bg-gray-800 rounded-lg">
                             <div className="flex items-center flex-col gap-3 text-sm text-white font-bold mb-1">
                                 <div className="text-white  gap-5">
                                 <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Image
                                            src={post.usuario.imagemPerfilUrl}
                                            alt={post.usuario.nome}
                                            height={50}
                                            width={60}
                                            className="rounded-full"
                                            />
                                            <h2 className="text-yellow-300">{post.usuario.nome}</h2>
                                        </div>

                                        <div className="text-red-500 cursor-pointer">
                                            <FontAwesomeIcon
                                            icon={faTrash}
                                            className="size-6 text-red"
                                            onClick={() => deletePost(post.id)}
                                            />
                                        </div>
                                    </div> 
                                    <div className="break-all overflow-hidden text-white w-full ">
                                        {post.conteudo}
                                    </div>
                             </div>

                                {post.imagemUrl !== null ? (
                                     <Image
                                    src={post.imagemUrl}
                                    alt={post.titulo}
                                    height={400}
                                    width={600}
                                    />
                                ) : <div className="h-[400px] w-[600px]"></div>}
                                
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
                            icon={faHeart}
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
        </div>

              {!view && 
              <Button
                label="ver mais"
                size={2}
                onClick={ViewPosts}
              />                 
            
              
              }
              
             
              {view && 
                
                <ProfileFeed/>
              }


        </div>
    );
}