import { signIn, signOut, useSession } from 'next-auth/client'
import { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../../components/Nav'
import { useCallback, useState } from 'react'
import api from '../../utils/api'

interface User {
  _id: string
  name: string
  email: string
  cellPhone: string
  teacher: boolean
  coins: number
  courses: string[]
  available_hours: Record<string, number[]>
  available_locations: string[]
  reviews: Record<string, unknown>[]
  appointments: Record<string, unknown>[]
}

const Search: NextPage = () => {
  const [textInput, setTextInput] = useState('')
  const [data, setData] = useState<User[]>([])
  const [ session, loading ] = useSession()

  const handleSearch = useCallback(() => {
      // api(`/search/${textInput}`).then((response) => {
      api(`/api/search/60f96d32b2ff881bb8752a59`).then((response) => {
        const users: User[] = response.data
        setData(users)
      })
    },
    [setTextInput, setData]
  )

  return (
    <div>
      
      <Head>
        <title>Search</title>
      </Head>

      <Nav />

      {!session && <>
        Not signed in <br/>
        <button onClick={() => signIn('auth0')}>Sign in</button>
      </>}
      {session && (
        <>
          <h1>Bem vindo a página Search!</h1>
          <div>
            Signed in as {session.user.email} <br/>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            type="text"
            placeholder="Nome da matéria"
            className="bg-pink-200"
          />
          <button
            type="submit"
            className="bg-blue-200"
            onClick={handleSearch}>
              Pesquisar
          </button>
          {data.length > 0 && data.map((user) => (
            <h1 key={user._id}>{user.name}</h1>
          ))}
        </>
      )}
    {loading && (
      <div className="text-3xl">
        <h1>Carregando</h1>
      </div>
    )}
        
    </div>
  )
}

export default Search