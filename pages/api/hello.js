// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connect from "../../utils/database"

export default async function helloAPI(req, res) {
  const { db } = await connect()
  const response = await db.collection('users').findOne({name: 'Teilor'})
  res.status(200).json(response)
  // res.status(200).json({ name: 'John Doe' })
}
