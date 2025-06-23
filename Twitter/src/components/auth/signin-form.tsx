"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const SigninForm = () => {
    const router = useRouter();
    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const handleEnterButton = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redes/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailField,
                    senha: passwordField
                })
            });

            const data = await response.json();

            if (response.ok) {
      
                localStorage.setItem('token-usuario', JSON.stringify(data.token));
                localStorage.setItem('id-usuario', JSON.stringify(data.id));
                router.replace('/home');
            } else {
                alert(data.message || 'Erro ao fazer login.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro na requisição');
        }
    }

    return (
        <>
            <Input
                placeholder="Digite seu e-mail"
                value={emailField}
                onChange={e => setEmailField(e)}
            />

            <Input
                placeholder="Digite sua senha"
                value={passwordField}
                onChange={e => setPasswordField(e)}
            />

            <Button
                label="Entrar"
                onClick={handleEnterButton}
                size={1}
            />
        </>
    );
}
