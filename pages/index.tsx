import Head from 'next/head'
import { Nav } from '../components/Nav'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Next Classroom</title>
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div>
          <Nav />
          <div className="py-10">
            <h1 className="text-5xl text-center text-accent-1">
              Next Classroom
            </h1>
          </div>
        </div>
      </main>
    </div>
  )
}
