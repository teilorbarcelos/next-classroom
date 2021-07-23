import { NextComponentType } from "next"

const BtnBlue: NextComponentType = (props) => {
  return (
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >{props.children}</button>
  )
}

export default BtnBlue