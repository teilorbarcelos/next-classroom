import { signIn, signOut, useSession } from 'next-auth/client'
import { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../components/Nav'

const Home: NextPage = () => {
  const [ session, loading ] = useSession()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Next Classroom</title>
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div>
          <Nav />
          {!session && <>
            Not signed in <br/>
            <button onClick={() => signIn()}>Sign in</button>
          </>}
          {session && <>
            Signed in as {session.user.email} <br/>
            <button onClick={() => signOut()}>Sign out</button>
          </>}
        </div>
      </main>
    </div>
  )
}

export default Home
