import axios from "axios"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

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

export default function UserProfile({name, email, _id}: User): JSX.Element {
  return (
    <>
      <h1>Perfil do usuário {name}!</h1>
      <h1>email: {email}</h1>
      <h1>ID: {_id}</h1>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const _id = context.query._id as string
  const response = await axios.get<User>(`http://localhost:3000/api/search/${_id}`)

  const user = response.data

  return {
    props: user
  }
}