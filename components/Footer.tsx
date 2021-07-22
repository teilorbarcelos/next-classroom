import { NextComponentType } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const Footer: NextComponentType = () => {
  return (
    <div className="bg-footer flex flex-row items-center text-white text-xl justify-center">
      <Image src="/logo2.png" alt="Logo Teach Other" width={100} height={100} />
      <h2 className="ml-10">
        Feito em NextJs por <Link href="https://github.com/teilorbarcelos"><a target="_blank">Teilor Souza Barcelos</a></Link>
      </h2>
    </div>
  )
}

export default Footer