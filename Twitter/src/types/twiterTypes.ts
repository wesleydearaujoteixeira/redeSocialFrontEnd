

export interface User {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: string[]; // Caso queira detalhar mais sobre as authorities, pode criar uma interface específica
    credentialsNonExpired: boolean;
    email: string;
    enabled: boolean;
    id: number;
    imagemPerfilUrl: string;
    perfilBackground: string;
    bio: string;
    link: string;
    nome: string;
    password: string;
    senha: string;
    username: string;
    totalPosts: number;
  }

  export type Perfil = {
    id: number;
    nome: string;
    imagemPerfilUrl: string;
    bio: string;
    background: string;
    link: string;
  };
  
  
export type Post = {
  id: number;
  titulo: string;
  conteudo: string;
  imagemUrl: string;
  usuario: User;
  totalComentarios: number;
  totaldeLikes: number;
  liked: boolean;
};


export interface Comentario {
  id: number;
  texto: string;
  post: Post;
  usuario: {
    id: number;
    nome: string;
    email: string;
    senha: string;
    imagemPerfilUrl: string;
    perfilBackground: string;
    bio: string;
    link: string;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    totalPosts: number;
    password: string;
    username: string;
    authorities: any[];
    credentialsNonExpired: boolean;
    enabled: boolean;
  };
}


interface Usuario {
  id: number;
  nome: string;
  imagemPerfilUrl: string;
  bio: string;
  background: string;
  link: string;
}

export type Respostas = {
  id: number;
  texto: string;
  usuario: Usuario;
}

export interface Notificacao {
  id: number;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
  destinatario: Usuario;
  comentario: Comentario;
}

