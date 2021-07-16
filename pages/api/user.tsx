import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../utils/database"

export default async (req: NextApiRequest, resp: NextApiResponse) => {

  const validateParam = (parameter: string) => {
    let valid = false
    if(parameter.trim() != ''){
      valid = true
    }
    return valid
  }

  if(req.method === 'POST'){
    const {name, email, cellPhone, teacher} = req.body

    if(!validateParam(name) ||
      !validateParam(email) ||
      !validateParam(cellPhone) ||
      !validateParam(teacher)){

      resp.status(400).json({error: 'Missing some information!'})
      return

    }

    const { db } = await connect()

    const response = await db.collection('users').insertOne({
      name,
      email,
      cellPhone,
      teacher
    })
    
    // const response = await db.collection('users').findOne({email: email})
    
    resp.status(200).json(response)

  }else{
    resp.status(400).json({error: 'this route is only to post requests!'})
  }
  
}