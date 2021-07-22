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
  coins: number
  courses: string[]
  available_hours: Record<string, number[]>
  available_locations: string[]
  reviews: Record<string, unknown>[]
  appointments: Record<string, unknown>[]
}

export default async (
  req: NextApiRequest,
  resp: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

  if(req.method === 'GET'){
    const _id = req.query._id as string
    const {db} = await connect()
    let response:SuccessResponseType

    try {
      if(_id.indexOf('@') == -1){
        response = await db.findOne({"_id": new ObjectId(_id), teacher: true})
      }else{
        response = await db.findOne({"email": _id})
      }
    } catch {
        resp.status(400).json({ error: 'Invalid ID parameter!' })
        return
    }

    if(!response){
      resp.status(400).json({error: 'This user not existis!'})
      return
    }
    
    resp.status(200).json(response)
  }else{
    resp.status(400).json({error: 'Wrong request method!'})
  }
  
}