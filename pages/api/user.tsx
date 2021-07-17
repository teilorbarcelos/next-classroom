import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../utils/database"

export default async (req: NextApiRequest, resp: NextApiResponse) => {

  if(req.method === 'GET'){
    const {name, email, cellPhone, teacher} = req.body

    if(!name ||
      !email ||
      !cellPhone ||
      !teacher){

      resp.status(400).json({error: 'Missing some information!'})
      return

    }

    const { db } = await connect()

    // const response = await db.collection('users').insertOne({
    //   name,
    //   email,
    //   cellPhone,
    //   teacher
    // })
    
    const response = await db.collection('users').findOne({email: email})
    
    resp.status(200).json(response)

  }else{
    resp.status(400).json({error: 'this route is only to post requests!'})
  }
  
}