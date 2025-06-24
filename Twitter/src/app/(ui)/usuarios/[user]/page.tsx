'use client'
import { removerAspas } from '@/app/removeAspas'
import { Button } from '@/components/ui/button'
import { GeneralHeader } from '@/components/ui/general-header'
import { Perfil, Post, User } from '@/types/twiterTypes'
import { faComment, faLink } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [user, setUser] = useState<User>()
  const [posts, setPosts] = useState<Post[]>([])
  const [seguidores, setSeguidores] = useState<Perfil[]>([])
  const params = useParams()
  const id = params.user

  useEffect(() => {
    if (!id) return

    const tk = localStorage.getItem('token-usuario')
    const userId = localStorage.getItem('id-usuario')

    if (tk && userId !== null) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`https://rede-social-2.onrender.com/redes/user/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${removerAspas(tk)}`
            }
          })

          if (!response.ok) {
            console.error(`Erro HTTP ao buscar usuário: ${response.status}`)
            return
          }

          const data = await response.json()
          setUser(data)
        } catch (err) {
          console.error('Erro ao buscar usuário:', err)
        }

        try {
          const response = await fetch(`https://rede-social-2.onrender.com/redes/posts/usuario/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${removerAspas(tk)}`
            }
          })

          if (!response.ok) {
            console.error(`Erro HTTP ao buscar posts: ${response.status}`)
            return
          }

          const data = await response.json()
          setPosts(data)
        } catch (error) {
          console.error('Erro ao buscar posts:', error)
        }

        try {
          const response = await fetch(`https://rede-social-2.onrender.com/redes/seguidores/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${removerAspas(tk)}`
            }
          })

          if (!response.ok) return

          const data = await response.json()
          setSeguidores(data)
        } catch (error) {
          console.error('Erro ao buscar seguidores:', error)
        }
      }
      fetchUser()
    }
  }, [id])

  const unFollowButton = async () => {
    const userId = localStorage.getItem('id-usuario')
    const token = localStorage.getItem('token-usuario')

    if (!userId || !token) return

    try {
      const response = await fetch(`https://rede-social-2.onrender.com/redes/unfollow/${userId}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${removerAspas(token)}`
        }
      })

      if (response.ok) {
        alert('Você deixou de seguir esse usuário')
        location.reload()
      } else {
        console.error('Erro ao deixar de seguir:', response.status)
      }
    } catch (error) {
      console.error('Erro na requisição unfollow:', error)
    }
  }


  if (!user) {
    return <div className="text-center text-white mt-10">Carregando perfil...</div>
}


  return (
    <div>
      <GeneralHeader backHref="/">
        <div className="font-bold text-lg"> </div>
        <div className="text-xs text-gray-500"> {user?.totalPosts} posts </div>
      </GeneralHeader>

      <section className="border-b-2 border-gray-900">
        {user && (
          <>
            {user.perfilBackground && (
              <div className="bg-gray-500 h-[100px] bg-no-repeat bg-cover bg-center">
                <img
                  src={user.perfilBackground}
                  alt={user.nome}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            <div className="-mt-12 flex justify-between items-end px-6">

              {user.imagemPerfilUrl && (
                <img
                  src={user.imagemPerfilUrl}
                  alt={user.nome}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}

              <div className='flex flex-col gap-3'>
                <div className="w-32">
                  <Button label="onfollow" size={2} onClick={unFollowButton} />
                </div>
              </div>
            </div>
          </>
        )}

        {user && (
          <div className="px-6 mt-4">
            <div className="text-xl font-bold text-white">{user.nome}</div>
            <div className="py-5 text-lg text-white">{user.bio}</div>

            {user.link && (
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faLink} className="size-5" />
                <Link href={user.link} target="_blank" className="text-blue-300">{user.link}</Link>
              </div>
            )}

            <div className="my-5 flex gap-6">
              <div className="text-xl text-gray-500">
                <span className="text-white">{seguidores.length}</span> Seguidor(es)
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="p-6 border-b-2 border-gray-900">
        {posts.length > 0 && posts.map(post => (
          <div key={post.id} className="mt-8">
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex flex-col gap-3 text-sm text-white font-bold mb-1">
                  <div className="text-white gap-5">
                    <div className="flex items-center gap-3">
                      
                      {post.usuario?.imagemPerfilUrl && (
                        <img
                          src={post.usuario.imagemPerfilUrl}
                          alt={post.usuario.nome}
                          className='rounded-full h-[40px] w-[40px]'
                        />

                        
                      )}
                      <h2 className="text-yellow-300">{post.usuario.nome}</h2>
                    </div>
                    <div className="mt-4 text-white break-words w-full max-w-full">
                      {post.conteudo}
                    </div>
                  </div>

                  {post.imagemUrl && (
                    <img
                      src={`${post.imagemUrl}`}         
                      alt={`Imagem do post de ${post.usuario.nome}`}
                      className='mt-2 rounded h-[400px] w-[400px]'
                    />

                  )}
                </div>

                <div className="flex items-center justify-center mt-4 text-gray-500 w-[50%] mx-auto">
                  <div className="flex-1">
                    <Link href={`/tweet/${post.id}`}>
                      <div className="inline-flex items-center gap-2 cursor-pointer">
                        <FontAwesomeIcon icon={faComment} className="size-6" />
                        <span className="text-lg">{post.totalComentarios}</span>
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 cursor-pointer">
                      <FontAwesomeIcon icon={faHeartFilled} className="size-6 text-red" />
                      <span className="text-lg">{post.totaldeLikes}</span>
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
