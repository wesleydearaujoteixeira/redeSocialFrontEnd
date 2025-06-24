"use client";

import { removerAspas } from "@/app/removeAspas";
import { Post } from "@/types/twiterTypes";
import { faComment, faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RecommendationArea } from "../ui/recommendation-area";


export const TweetItem = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [id, setId] = useState<string | null>();
  const [tk, setToken] = useState<string>("");





  useEffect(() => {
    const userId = localStorage.getItem('id-usuario');
    const newToken = localStorage.getItem('token-usuario');

    if(!userId || !newToken){
      console.log("Usuário Id não existe ou token inexistente! ");
      return;
    }else {
      setId(userId);
      setToken(newToken);

    }

  }, []);


  const handleLikeButton = async (postId: number) => {

    console.log(" id da postagem " + postId)
    try{

      const response = await fetch(`https://rede-social-2.onrender.com/redes/like/${postId}/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${removerAspas(String(tk))}`
        }  
    });

    if(response.status == 201){
      alert("Like dado com sucesso")
      fetchPosts(tk);
    }

    else if (response.status == 200){
      alert(" Deslike nessa postagem ");
      fetchPosts(tk);

    }

    }catch(e){
      
    }


  
  };


  const fetchPosts = async (token: string) => {
    try {
      const response = await fetch(`https://rede-social-2.onrender.com/redes/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${removerAspas(token)}`,
        },
      });

      if (!response.ok) {
        console.error(`Erro http ${response.status}`);
        return;
      }

      const data = await response.json();
      setPosts(data);

     
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token-usuario");
    if (!token) return;

   

    fetchPosts(token);
  }, []);

  return (
    <div className="p-3 border-b-2 border-gray-900">
      {posts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-3 text-white">Outros Posts</h3>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 bg-gray-800 rounded-lg ">
                <div className="flex items-center gap-3 text-sm text-white font-bold mb-1  ">
                  <Link href={`usuarios/${post.usuario.id}`}> 
                  <Image
                    src={post.usuario.imagemPerfilUrl}
                    alt="usuario"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  </Link>
                
                  <Link href={`usuarios/${post.usuario.id}`} className="text-yellow-500 hover:underline"> 
                    {post.usuario?.nome || "Usuário desconhecido"}
                  </Link>
                </div>
                  <div className="text-white break-words w-full max-w-full">
                    {post.conteudo}
                  </div>
                {post.imagemUrl !== null && (
                  <Link href={`/tweet/${post.id}`}>
                      <Image
                        src={post.imagemUrl}
                        alt="Imagem do post"
                        className="mt-2 rounded"
                        width={400}
                        height={400}
                      />
                  </Link>
                )}
                <div className="flex items-center justify-center mt-4 text-gray-500 w-[40%] mx-auto">
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
                      onClick={() => handleLikeButton(post.id)}
                      className={`inline-flex items-center gap-2 cursor-pointer`}>
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="size-5"
                      />
                      <span className="text-lg"> {post.totaldeLikes} </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


    

      </div>
      )}

     


    </div>
  );
};
