import useSWR from 'swr'
import api from '../utils/api'
import { signIn, signOut, useSession } from 'next-auth/client'
import { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../components/Nav'

const Profile: NextPage = () => {
  const [ session, loading ] = useSession()
  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api)
  // const { data, error } = useSWR(`/api/user/60f6c880fb48c04b96f0d15d`, api)

  return (
    <div>
      
      <Head>
        <title>Profile</title>
      </Head>

      <Nav />

      {!session && <>
        Favor, faça login para visualizar esta página! <br/>
        <button onClick={() => signIn('auth0')}>Sign in</button>
        </>
      }
      {session && data && (
        <>
          <h1>Your Profile!</h1>
          Signed in as {session.user.email} <br/>
          <button onClick={() => signOut()}>Sign out</button>
          <p>{data.data.name}</p>
          <p>{data.data.coins} Moedas</p>
        </>
      )}
      {error &&
        <h1>Ousuário referente ao ID {session.user.email} não existe!</h1>
      }
      {loading && (
        <div className="text-3xl">
          <h1>Carregando</h1>
        </div>
      )}

    </div>
  )
}

export default Profile