'use client'

import { removerAspas } from "@/app/removeAspas";
import { Button } from "@/components/ui/button";
import { GeneralHeader } from "@/components/ui/general-header";
import { Comentario, Post, Respostas } from "@/types/twiterTypes";
import { faComment, faHeart, faImage, faRetweet, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const params = useParams();
  const id = params.id;
  const mainCommentRef = useRef<HTMLDivElement>(null);
  const mainReplyRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);


    const [respostas, setRespostas] = useState<Respostas[]>([]);


  const fetchPost = async (token: string) => {
    try {
      const response = await fetch(`https://rede-social-2.onrender.com/redes/get/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Erro ao buscar o post:", error);
    }
  };

  const fetchComentarios = async (token: string) => {
    try {
      const response = await fetch(`https://rede-social-2.onrender.com/redes/comentario/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setComentarios(data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  useEffect(() => {
    const token = removerAspas(localStorage.getItem('token-usuario') ?? "");
    if (token && id) {
      fetchPost(token);
      fetchComentarios(token);
    }
  }, [id]);

  const handleCommentClick = async () => {
    const usuarioId = localStorage.getItem('id-usuario') ?? "";
    const tk = removerAspas(localStorage.getItem('token-usuario') ?? "");

    if (!comment.trim()) {
      alert("O comentário não pode estar vazio.");
      return;
    }

    try {
      const response = await fetch(`https://rede-social-2.onrender.com/redes/comentario/${usuarioId}/${id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${removerAspas(String(tk))}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ texto: comment })
      });

      const result = await response.text();
      setComment("");
      if (mainCommentRef.current) mainCommentRef.current.textContent = "";
      fetchComentarios(tk);

    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  const replyPost = async (idComentario: number) => {

    const token = localStorage.getItem("token-usuario");
    const userId = localStorage.getItem("id-usuario");

    if(!token || !userId){
        console.log("Problemas");
        return;
    }

    if(replyComment === ""){
        alert(" Não pode enviar um comentário vázio");
        return;
    }

    if(!idComentario){
        console.log(" Não existe esse comentario! ")
    }


    const response = await fetch(`https://rede-social-2.onrender.com/redes/respostas/${userId}/${idComentario}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${removerAspas(String(token))}`
        },
        body: JSON.stringify({ texto: replyComment })
    });

    if(response.status == 201){
        const data = await response;
        console.log(data);
        if (mainReplyRef.current) mainReplyRef.current.textContent = "";
        handleReplyClick(idComentario);

    }else{
        const data = await response;

    }

  }

  const handleReplyClick = async (commentId: number) => {
    setReplyingToCommentId(commentId);

    const tk = localStorage.getItem('token-usuario');
    if (!tk) {
      alert("Token não passado!");
      return;
    }

    try {
      const response = await fetch(`https://rede-social-2.onrender.com/redes/respostas/${commentId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${removerAspas(String(tk))}`
        }
      });

      const data = await response.json();
      setRespostas(data);
    } catch (error) {
    }

    


  };

  const deleteComment = async (commentId: number, id: number) => {


      const userId = localStorage.getItem("id-usuario");
      const token = localStorage.getItem("token-usuario");


      

      if(!userId || !token){
        alert("Token  ou userid inválidos ");
        return;
      }

      if(Number(userId) !== id){
          alert("Você não pode deletar uma postagem que não é sua! ");
          return;
      }


      const deletando = confirm("Deseja deletar esse comentario? ");

      if(!deletando){
        return;
      }


      try {

        const response = await fetch(`https://rede-social-2.onrender.com/redes/delete/comentario/${commentId}/${userId}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${removerAspas(String(token))}`
            }
        });
        
        if(response.status == 200){
          const data = response.text;
          alert("Comentário deletado com sucesso");
          location.reload();

        }

      } catch (error) {
      }

  }

  return (
    <div>
      <GeneralHeader backHref="/">
        <div className="font-bold text-lg">Voltar</div>
      </GeneralHeader>

      <div className="border-t-2 border-gray-900 p-6">
        {post && (
          <div className="p-4 bg-gray-800 rounded-lg space-y-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-white font-bold">
              <Image
                src={post.usuario?.imagemPerfilUrl || "/default.png"}
                alt={post.usuario?.nome || "Usuário"}
                width={50}
                height={50}
                className="rounded-full"
              />
              <h2 className="text-yellow-300">{post.usuario?.nome}</h2>
            </div>
            <div className="text-white">{post.conteudo}</div>
            {post.imagemUrl && (
              <Image
                src={post.imagemUrl}
                alt="Imagem do post"
                width={450}
                height={450}
                priority
              />
            )}
          </div>
        )}

        <h1 className="text-white font-semibold mb-4">Comentários ({comentarios.length})</h1>

        <div className="border-y-8 border-gray-900 mb-6 p-4">
          <div className="min-h-14 outline-none text-lg text-white empty:before:text-gray-500 empty:before:content-[attr(data-placeholder)]"
            ref={mainCommentRef}
            contentEditable
            role="textbox"
            data-placeholder="Quer comentar algo nesse post?"
            onInput={(e) => setComment(e.currentTarget.textContent || '')}
          ></div>
          <div className="flex justify-end mt-2">
            <div className="w-28">
              <Button label="Comentar" size={2} onClick={handleCommentClick} />
            </div>
          </div>
        </div>

        <div className="container max-h-[500px] overflow-y-auto">
          {comentarios.map((comment) => (
            <div key={comment.id} className="p-5 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Image
                  src={comment.usuario?.imagemPerfilUrl || "/default.png"}
                  alt={comment.usuario?.nome || "Usuário"}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <h2 className="text-yellow-300">{comment.usuario?.nome || "Usuário"}</h2>
                <span onClick={() => deleteComment(comment.id, comment.usuario.id)} className="cursor-pointer"> 
                  <FontAwesomeIcon
                        icon={faTrash}
                        className="size-3 text-red-600"
                        
                    /> 
                </span>
              </div>
              <p className="text-white mb-2">{comment.texto}</p>


              {replyingToCommentId === comment.id && (
                <div className="bg-gray-700  overflow-y-auto rounded-lg p-4 space-y-2 gap-6">
                  
                  {respostas && respostas.length > 0 ? respostas.map((res) => {
                    return (
                        <div key={res.id} className="flex flex-col">
                            <div className="flex items-center gap-2" >
                                <Image
                                    src={res.usuario.imagemPerfilUrl}
                                    alt={res.usuario.nome}
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                />
                                <h1 className="text-green-400"> {res.usuario.nome} </h1>                                
                            </div>
                            <p> {res.texto} </p>
                            <hr />
                        </div>
                    )
                  }) : <span> Não há respostas nesse comentário ainda... </span>}
                  
                </div>
              )}
                <div
                    className="min-h-14 outline-none  text-white empty:before:text-gray-100 empty:before:content-[attr(data-placeholder)]"
                    contentEditable
                    ref={mainReplyRef}
                    role="textbox"
                    onInput={(e) => setReplyComment(e.currentTarget.textContent || '')}
                  ></div>

              <div className="mt-2">
                <Button label="Responder" size={2} onClick={() => replyPost(comment.id)} />
              </div>
              <div className="mt-2">
                <Button label="Ver Respostas" size={2} onClick={() => handleReplyClick(comment.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
