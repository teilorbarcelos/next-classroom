import useSWR from 'swr'
import axios from 'axios'
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
  const [monday, setMonday] = useState(null)
  const [tuesday, setTuesday] = useState(null)
  const [wednesday, setWednesday] = useState(null)
  const [thursday, setThursday] = useState(null)
  const [friday, setFriday] = useState(null)

  const [ session, loading ] = useSession()
  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const available_hours = {
      
      monday: monday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),
      
      tuesday: tuesday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),
    
      wednesday: wednesday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),
  
      thursday: thursday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item)),

      friday: friday
        ?.split(',')
        .map(item => item.trim())
        .map(item => parseInt(item))
    }

    for(const dayOfTheWeek in available_hours){
      if(!available_hours[dayOfTheWeek]){
        delete available_hours[dayOfTheWeek]
      }
    }

    const data = {
      name,
      email,
      cellphone,
      teacher: isTeacher,
      courses: courses.split(',').map((item) => item.trim()),
      available_locations: availableLocations.split(',').map((item) => item.trim()),
      available_hours
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user`, data)
    } catch (error) {
      alert('Ocorreu um erro durante a requisição: ' + error.response.data.error)
    }
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