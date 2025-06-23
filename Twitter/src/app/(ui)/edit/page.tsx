'use client'
import { removerAspas } from "@/app/removeAspas";
import { Button } from "@/components/ui/button";
import { GeneralHeader } from "@/components/ui/general-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/twiterTypes";
import { faCamera} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState<User>();
    const [tk, setTk] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    const [nome, setNome] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [image, setImage] = useState <File | null>(null);
    const [backgroundImage, setBackGroundImage] = useState<File | null> (null);


    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewBackground, setPreviewBackground] = useState<string | null>(null);


    useEffect(() => {
        const token = localStorage.getItem("token-usuario");
        const id = localStorage.getItem("id-usuario");

        if (!token || !id) return;

        setTk(token);
        setUserId(id);
    }, []);

    useEffect(() => {
        if (tk && userId) {
            const fetchUser = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/user/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
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

    useEffect(() => {
        if (user) {
            setNome(user.nome || "");
            setBio(user.bio || "");
            setLink(user.link || "");
        }
    }, [user]);


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));

        }
    };

    const handleBackGroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setBackGroundImage(file);
            setPreviewBackground(URL.createObjectURL(file));
        }
    };


    const updateUser = async () => {

        const formData = new FormData();

        formData.append("nome", nome.trim());
        formData.append("bio", bio.trim());
        formData.append("link", link.trim());

        if(image){
            formData.append("imagem", image);
        }

        if(backgroundImage){
            formData.append("perfilBackground", backgroundImage);

        }

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/update/${userId}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${removerAspas(tk)}`
                },
    
                body: formData
            });
    
            const data = await response.text();


            location.reload();
            
        } catch (error) {
        }
    }

    return (
        <div>
            <GeneralHeader backHref="/profile">
                <div className="font-bold text-lg">Editar perfil</div>
            </GeneralHeader>

            <section className="border-b-2 border-gray-900">
                    <div
                        className="flex justify-center h-[200px] w-full items-center gap-4 bg-gray-500 bg-no-repeat bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${previewBackground || user?.perfilBackground})`,
                          }}
                        >
                        <label className="cursor-pointer bg-black/80 flex justify-center items-center size-12 rounded-full">
                            <FontAwesomeIcon icon={faCamera} className="size-6 text-white" />
                            <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleBackGroundUpload} 
                            className="hidden" 
                            />
                        </label>
                        </div>
                <div className="-mt-12 px-6">
                    <img
                        src={previewImage || user?.imagemPerfilUrl}
                        alt={user?.nome}
                        className="size-24 rounded-full"
                    />
                    <div className="-mt-24 size-24 flex justify-center items-center">
                        <div className="cursor-pointer bg-black/80 flex justify-center items-center size-12 rounded-full">
                        <label className="cursor-pointer bg-black/80 flex justify-center items-center size-12 rounded-full">
                            <FontAwesomeIcon icon={faCamera} className="size-6" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="hidden" 
                            />
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <section className="p-6 flex flex-col gap-4">
                <label>
                    <p className="text-lg text-gray-500 mb-2">Nome</p>
                    <Input
                        placeholder="Digite seu nome"
                        value={nome}
                        onChange={setNome}
                    />
                </label>

                <label>
                    <p className="text-lg text-gray-500 mb-2">Bio</p>
                    <Textarea
                        placeholder="Descreva você mesmo"
                        rows={4}
                        value={bio}
                        onChange={setBio}
                    />
                </label>

                <label>
                    <p className="text-lg text-gray-500 mb-2">Link</p>
                    <Input
                        placeholder="Digite um link"
                        value={link}
                        onChange={setLink}
                    />
                </label>

                <Button
                    label="Salvar alterações"
                    size={1}
                   onClick={() => updateUser()}
                />
            </section>
        </div>
    );
}
