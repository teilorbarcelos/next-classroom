import { NextPage } from 'next'

const Nav: NextPage = () => {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/app">App</a>
        </li>
      </ul>
    </nav>
  )
}

export default Nav