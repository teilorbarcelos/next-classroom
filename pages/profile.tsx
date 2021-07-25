import useSWR from 'swr'
import api from '../utils/api'
import { signIn, signOut, useSession } from 'next-auth/client'
import { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../components/Nav'
import BtnBlue from '../components/BtnBlue'
import React, { FormEvent, useState } from 'react'

const Profile: NextPage = () => {
  const [isTeacher, setIsTeacher] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cellphone, setCellphone] = useState('')
  const [courses, setCourses] = useState('')
  const [availableLocations, setAvailableLocations] = useState('')
  const [monday, setMonday] = useState('')
  const [tuesday, setTuesday] = useState('')
  const [wednesday, setWednesday] = useState('')
  const [thursday, setThursday] = useState('')
  const [friday, setFriday] = useState('')

  const [ session, loading ] = useSession()
  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = {
      name,
      email,
      cellphone,
      isTeacher,
      courses: courses.split(',').map((item) => item.trim()),
      availableLocations: availableLocations.split(',').map((item) => item.trim()),
      monday,
      tuesday,
      wednesday,
      thursday,
      friday
    }

    console.log(data)
  }

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
          Signed in as {session?.user.email} <br/>
          <button onClick={() => signOut()}>Sign out</button>
          <p>{data.data.name}</p>
          <p>{data.data.coins} Moedas</p>
        </>
      )}
      {session && error &&
      <div className="flex flex-col items-center">
        <h1 className="text-3xl">Seja bem vindo ao Next Classroom, {session.user.name}!</h1>
        <h1 className="text-2xl">Favor, complete a criação do seu perfil:</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center mb-10">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            className="bg-pink-200 px-2 my-4"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="bg-pink-200 px-2 my-4"
          />
          <input
            type="cellphone"
            value={cellphone}
            onChange={(e) => setCellphone(e.target.value)}
            placeholder="Cellphone"
            className="bg-pink-200 px-2 my-4"
          />
          <div className="my-4">
            <label htmlFor="teacher" className="mx-2">Desejo ser professor:</label>
            <input
              type="checkbox"
              id="teacher"
              name="teacher"
              onClick={() => isTeacher ? setIsTeacher(false) : setIsTeacher(true)}
            />
          </div>
          {isTeacher && (
            <>
              <h1>Matérias que você domina (separadas por vírgula)</h1>
              <input
                type="text"
                value={courses}
                onChange={(e) => setCourses(e.target.value)}
                placeholder="Engenharia Mecatrônica, Astrofísica..."
                className="bg-pink-200 w-full px-2 my-4"
              />
              <h1>Locais onde você pode dar aulas:</h1>
              <input
                type="text"
                value={availableLocations}
                onChange={(e) => setAvailableLocations(e.target.value)}
                placeholder="Ex.: https://letmeask-f38c5.web.app , em casa..."
                className="bg-pink-200 w-full px-2 my-4"
              />
              <h1>Horários que você pode dar aulas:</h1>
              <h2>Segunda:</h2>
              <input
                type="text"
                value={monday}
                onChange={(e) => setMonday(e.target.value)}
                placeholder="Ex.: 8, 10, 14,16..."
                className="bg-pink-200 w-full px-2 my-4"
              />
              <h2>Terça:</h2>
              <input
                type="text"
                value={tuesday}
                onChange={(e) => setTuesday(e.target.value)}
                placeholder="Ex.: 8, 10, 14,16..."
                className="bg-pink-200 w-full px-2 my-4"
              />
              <h2>Quarta:</h2>
              <input
                type="text"
                value={wednesday}
                onChange={(e) => setWednesday(e.target.value)}
                placeholder="Ex.: 8, 10, 14,16..."
                className="bg-pink-200 w-full px-2 my-4"
              />
              <h2>Quinta:</h2>
              <input
                type="text"
                value={thursday}
                onChange={(e) => setThursday(e.target.value)}
                placeholder="Ex.: 8, 10, 14,16..."
                className="bg-pink-200 w-full px-2 my-4"
              />
              <h2>Sexta:</h2>
              <input
                type="text"
                value={friday}
                onChange={(e) => setFriday(e.target.value)}
                placeholder="Ex.: 8, 10, 14,16..."
                className="bg-pink-200 w-full px-2 my-4"
              />
            </>
          )}
          <BtnBlue children="Criar Perfil" />
        </form>
      </div>
      }
      {loading && (
        <div className="text-3xl">
          <h1>Carregando...</h1>
        </div>
      )}

    </div>
  )
}

export default Profile