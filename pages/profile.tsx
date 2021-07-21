import { signIn, signOut, useSession } from 'next-auth/client'
import { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../components/Nav'

const Profile: NextPage = () => {
  const [ session, loading ] = useSession()
  return (
    <div>
      
      <Head>
        <title>Profile</title>
      </Head>

      <Nav />

      <h1>Bem vindo(a) a página profile!</h1>

      {!session && <>
            Not signed in <br/>
            <button onClick={() => signIn('auth0')}>Sign in</button>
          </>}
          {session && <>
            Signed in as {session.user.email} <br/>
            <button onClick={() => signOut()}>Sign out</button>
          </>}
        {loading && (
          <div className="text-3xl">
            <h1>Carregando</h1>
          </div>
        )}

    </div>
  )
}

export default Profile
