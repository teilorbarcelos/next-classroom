import { NextPage } from 'next'
import Link from 'next/link'

const Nav: NextPage = () => {
  return (
    <nav className="w-full">
      <ul className="flex justify-between items-center p-8">
        <li>
          <Link href="/">
            <a className="text-blue-500 no-underline">NEXT CLASSROOM</a>
          </Link>
        </li>
        <ul className="flex justify-between items-center space-x-4">
          <li>
            <Link href="/profile">
              <a className="text-blue-500 no-underline">Perfil</a>
            </Link>
          </li>
          <li>
            <Link href="/search">
              <a className="text-blue-500 no-underline">Search</a>
            </Link>
          </li>
        </ul>
      </ul>
    </nav>
  )
}

export default Nav