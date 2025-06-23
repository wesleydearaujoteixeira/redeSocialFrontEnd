"use client";
import { User } from "@/types/twiterTypes";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { removerAspas } from "@/app/removeAspas";
import Image from "next/image";

export const TweetPost = () => {
    const [postContent, setPostContent] = useState<string>('');  // Para armazenar o conteúdo do post
    const [image, setImage] = useState<File | null>(null); // Para armazenar a imagem
    const [tk, setTk] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<User>();
    
    // Captura do token e ID do usuário
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
                if (!tk || userId === null) return;

                try {
                    const response = await fetch(`https://rede-social-2.onrender.com/redes/user/${Number(userId)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'Application/json',
                            'Authorization': `Bearer ${removerAspas(tk)}`
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

    // Função para capturar o upload da imagem
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImage(file);
        }
    };

    // Função para enviar o post
    const handlePostClick = async () => {

        if (!postContent) {
            alert("Você precisa adicionar conteúdo ao seu post.");
        }

        const token = localStorage.getItem("token-usuario");
        if (!token) {
            alert("Você precisa estar logado.");
            return;
        }

        const formData = new FormData();
        formData.append("titulo", "nuloLolusco")
        formData.append("conteudo", postContent);
        formData.append("usuarioId", String(userId));
        if (image) {
            formData.append("imagem", image); // Adiciona a imagem se houver
        }

        try {
            const response = await fetch(`https://rede-social-2.onrender.com/redes/post/create`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${removerAspas(token)}` // Envia o token para autenticação
                },
                body: formData // Envia o FormData com conteúdo e imagem
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            console.log("Post criado com sucesso:", data);

            setPostContent("");
            setImage(null);

            location.reload();
            

        } catch (err) {
            console.error("Erro na requisição de criação de post:", err);
        }
    };

        return (
                    <div className="flex gap-6 px-8 py-6 border-b-2 border-gray-900">
            <div className="rounded-full">
                {user && (
                <Image
                    src={user.imagemPerfilUrl}
                    width={60}
                    height={60}
                    alt="Foto do perfil"
                    className="rounded-full object-cover"
                />
                )}
            </div>

            <div className="flex-1">
                <div
                className="w-full max-w-[400px] outline-none break-words  text-white p-4 rounded-lg px-4 py-2 rounded-md empty:before:text-gray-500 empty:before:content-[attr(data-placeholder)]"
                contentEditable
                role="textbox"
                data-placeholder="O que está acontecendo?"
                onInput={(e) => setPostContent(e.currentTarget.textContent || '')}
                />
                
                <div className="flex justify-between items-center mt-4">
                <label htmlFor="file-input" className="cursor-pointer text-gray-300 hover:text-white">
                    <FontAwesomeIcon icon={faImage} className="size-6" />
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-input"
                />

                <div className="w-28">
                    <Button label="Postar" size={2} onClick={handlePostClick} />
                </div>
                </div>
            </div>
            </div>

)
};
