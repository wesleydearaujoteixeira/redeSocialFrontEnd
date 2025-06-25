'use client'
import { removerAspas } from "@/app/removeAspas";
import { ProfileFeed } from "@/components/profile/profile-feed";
import { Button } from "@/components/ui/button";
import { GeneralHeader } from "@/components/ui/general-header";
import { Post, User } from "@/types/twiterTypes";
import { faComment, faLink, faRotateRight, faTrash } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
  const [user, setUser] = useState<User>();
  const [tk, setTk] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [seguindo, setSeguidores] = useState([]);
  const [seguidores, setSeguidos] = useState([]);
  const [view, setView] = useState<boolean>(false);

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const ViewPosts = () => setView(!view);

  const deletePost = async (id: number) => {
    const userId = localStorage.getItem("id-usuario");
    const token = localStorage.getItem("token-usuario");
    const deletar = confirm("Deseja mesmo deletar esse post?");

    if (deletar) {
      try {
        const response = await fetch(
          `https://rede-social-2.onrender.com/redes/delete/post/${id}/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${removerAspas(String(token))}`,
            },
          }
        );

        if (response.status == 200) {
          alert("Deletando post...");
          location.reload();
        } else {
          console.log("houve algo estranho");
        }
      } catch (error) {
        console.log("Houve algo estranho! ");
      }
    }
  };

  const updatePost = async (postId: number) => {
    if (!tk || !userId) return;
    const formData = new FormData();
    formData.append("titulo", "tituloDoPost")
    formData.append("conteudo", editContent);
    formData.append("usuarioId", userId);


        if (editImage) {
            formData.append("imagem", editImage)
        }else{
            formData.append("imagem", "")
        }


    console.log("PostId " + postId);
    console.log("Token " + tk);

    try {
      const res = await fetch(
        `https://rede-social-2.onrender.com/redes/post/atualizar/${postId}`,
        {
          method: "PATCH",
          headers: { 
            'Authorization': `Bearer ${removerAspas(tk)}` },

          body: formData
        },
      );

      if (res.ok) {
        alert("Post atualizado com sucesso!");
        setEditingPostId(null);
        location.reload();


      } else {
        console.error("Erro ao atualizar:", res.status);
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token-usuario");
    const id = localStorage.getItem("id-usuario");
    if (!token || !id) return;
    setTk(token);
    setUserId(id);
  }, []);

  useEffect(() => {
    if (tk && userId !== null) {

      const fetchUser = async () => {
        try {
          const [postsRes, userRes, seguindoRes, seguidoresRes] = await Promise.all([
            fetch(`https://rede-social-2.onrender.com/redes/posts/usuario/${userId}`, {
              headers: { Authorization: `Bearer ${removerAspas(tk)}` },
            }),
            fetch(`https://rede-social-2.onrender.com/redes/user/${userId}`, {
              headers: { Authorization: `Bearer ${removerAspas(tk)}` },
            }),
            fetch(`https://rede-social-2.onrender.com/redes/seguindo/${userId}`, {
              headers: { Authorization: `Bearer ${removerAspas(tk)}` },
            }),
            fetch(`https://rede-social-2.onrender.com/redes/seguidores/${userId}`, {
              headers: { Authorization: `Bearer ${removerAspas(tk)}` },
            }),
          ]);

          if (!postsRes.ok || !userRes.ok || !seguindoRes.ok || !seguidoresRes.ok) {
            console.error("Erro ao carregar dados");
            return;
          }

          setPosts(await postsRes.json());
          setUser(await userRes.json());
          setSeguidores(await seguindoRes.json());
          setSeguidos(await seguidoresRes.json());
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }
  }, [tk, userId]);

  return (
    <div>
      <GeneralHeader backHref="/">
        <div className="font-bold text-lg"> </div>
        <div className="text-xs text-gray-500"> {user?.totalPosts} posts </div>
      </GeneralHeader>

      <section className="border-b-2 border-gray-900">
        <div className="bg-gray-500 h-[100px] bg-no-repeat bg-cover bg-center">
          <img src={user?.perfilBackground} alt={user?.nome} className="h-[auto]" />
        </div>
        <div className="-mt-12 flex justify-between items-end px-6">
          <img src={user?.imagemPerfilUrl} alt={user?.nome} className="size-24 w-24 h-24 rounded-full object-cover" />
          <div className="w-32">
            {user && (
              <Link href={`/edit`}>
                <Button label="Editar Perfil" size={2} />
              </Link>
            )}
          </div>
        </div>
        {user && (
          <div className="px-6 mt-4">
            <div className="text-xl font-bold text-white">{user.nome}</div>
            <div className="py-5 text-lg text-white "> {user.bio} </div>
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faLink} className="size-5" />
              <Link href={user.email} target="_blank" className="text-blue-300">
                {user.link}
              </Link>
            </div>
            <div className="my-5 flex gap-6">
              <div className="text-xl text-gray-500">
                <span className="text-white"> {seguindo.length} </span> Seguindo
              </div>
              <div className="text-xl text-gray-500">
                <span className="text-white"> {seguidores.length} </span> Seguidores
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="p-6 border-b-2 border-gray-900">
        {posts.map((post) => (
          <div key={post.id} className="mt-8 space-y-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex flex-col gap-3 text-sm text-white font-bold mb-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Image src={post.usuario.imagemPerfilUrl} alt={post.usuario.nome} height={50} width={60} className="rounded-full" />
                  <h2 className="text-yellow-300">{post.usuario.nome}</h2>
                </div>
                <div className="flex gap-3">
                  

                <FontAwesomeIcon icon={faRotateRight} className="size-5 text-green cursor-pointer"  onClick={() => {
                      setEditingPostId(post.id);
                      setEditContent(post.conteudo);
                      setEditImage(null);
                    }} />

                <FontAwesomeIcon icon={faTrash} className="size-5 text-green cursor-pointer" onClick={() => deletePost(post.id)} />
                
                </div>
              </div>
              <div className="break-all overflow-hidden text-white w-full ">{post.conteudo}</div>
              {post.imagemUrl && <Image src={post.imagemUrl} alt={post.titulo} height={400} width={600} />}
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
                  <div className="inline-flex items-center gap-2 cursor-pointer">
                    <FontAwesomeIcon icon={faHeart} className="size-6 text-red" />
                    <span className="text-lg"> {post.totaldeLikes} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!view && <Button label="ver mais" size={2} onClick={ViewPosts} />}
      {view && <ProfileFeed />}

      {/* MODAL DE EDIÇÃO */}
      {editingPostId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-[90%] max-w-lg">

            <h2 className="text-white text-xl mb-4">Editar Post</h2>
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white resize-none mb-4"
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="text-white mb-4"
              onChange={(e) => e.target.files && setEditImage(e.target.files[0])}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingPostId(null)}
                className="bg-gray-700 px-4 py-2 rounded text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => updatePost(editingPostId)}
                className="bg-blue-500 px-4 py-2 rounded text-white"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}