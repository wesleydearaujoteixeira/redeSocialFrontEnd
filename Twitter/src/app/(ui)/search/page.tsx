'use client'
import { removerAspas } from "@/app/removeAspas";
import { GeneralHeader } from "@/components/ui/general-header";
import { SearchInput } from "@/components/ui/search-input";
import { Post } from "@/types/twiterTypes";
import { faComment, faHeart, faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
    searchParams: {
        q: string | undefined;
    }
}
export default function Page({ searchParams }: Props) {
    if (!searchParams.q) redirect('/');


    const searchParames = useSearchParams()
    const q = searchParames.get('q');

    const [posts, setPosts] = useState<Post[]>([]);
  
    useEffect(() => {
    
        const token = localStorage.getItem("token-usuario");

        if(!token){
            return;
        }



      if (q) {
      }

        const SearchPosts = async () => {

            try {
                
                const response = await fetch(`https://rede-social-2.onrender.com/redes/search/${q}`, {
                    headers: {
                        'Authorization': `Bearer ${removerAspas(token)}`
                    }
                });

            
                const data = await response.json();
                setPosts(data);


            } catch (error) {
                console.log(error)
            }

        

        }
    
    SearchPosts();

    }, [q])
  

    return (
        <div>
            <GeneralHeader backHref="/">
                <SearchInput defaultValue={searchParams.q} />
            </GeneralHeader>
            <div className="border-t-2 border-gray-900">
                <div>
                   {posts && posts.length > 0 && posts.map((post) => {
                        return (
                            
                        <div key={post.id} className="p-6 border-b-2 border-gray-900">
                        <div className="mt-8">
                           <div className="space-y-4">
                                <div  className="p-4 bg-gray-800 rounded-lg">
                                    <div className="flex items-center flex-col gap-3 text-sm text-white font-bold mb-1">
                                        <div className="text-white  gap-5">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={post.usuario.imagemPerfilUrl}
                                                    alt={post.titulo}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-full"
                                                />

                                                
                                                <h2 className="text-yellow-300"> {post.usuario.nome} </h2> 
                                            </div> 
                                                <div className="mt-4">
                                                    {post.conteudo}
                                                </div>
                                        </div>
                                                <Image
                                                    src={post.imagemUrl}
                                                    alt={post.titulo}
                                                    width={600}
                                                    height={400}
                                                />
                                        </div>
                                        <div className="flex mt-6 text-gray-500">
                  
                    <div className="flex-1">
                      <Link href={`/tweet/${post.id}`}>
                        <div className="inline-flex items-center gap-2 cursor-pointer">
                          <FontAwesomeIcon icon={faComment} className="size-6" />
                          <span className="text-lg">  {post.totalComentarios}</span>
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
                </div>
                    )})}
                </div>
                {posts.length === 0 && <> Infelizmente não há nada relacionado com {q} </>}
            </div>
        </div>
    );
}