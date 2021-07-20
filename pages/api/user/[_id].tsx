import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../../utils/database"
import {ObjectId} from "mongodb"

interface ErrorResponseType {
  error: string
}

interface SuccessResponseType {
  _id: string
  name: string
  email: string
  cellPhone: string
  teacher: true
  coins: 1
  courses: string[]
  available_hours: object
  available_locations: string[]
  reviews: object[]
  appointments: object[]
}

export default async (
  req: NextApiRequest,
  resp: NextApiResponse<ErrorResponseType | SuccessResponseType>
):Promise<void> => {

  if(req.method === 'GET'){
    const _id = req.query._id as string
    const {db} = await connect()
    let response:SuccessResponseType

    try {
        response = await db.collection('users').findOne({"_id": new ObjectId(_id)})
    } catch {
        resp.status(400).json({ error: 'Wrong objectID' })
        return
    }

    if(!response){
      resp.status(400).json({error: 'This user not existis!'})
      return
    }
    
    resp.status(200).json(response)
  }else{
    resp.status(400).json({error: 'this route is only to GET requests!'})
  }
  
}