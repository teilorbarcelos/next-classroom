import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../utils/database"
import {ObjectId} from "mongodb"

export default async (req: NextApiRequest, resp: NextApiResponse) => {

  if(req.method === 'POST'){
    const {name, email, cellPhone, teacher, coins, courses, available_hours, available_locations} = req.body

    if(!teacher){
      if(!name ||
        !email ||
        !cellPhone){
  
        resp.status(400).json({error: 'Missing some information!'})
        return
  
      }
    } else {
      if(!name ||
        !email ||
        !cellPhone ||
        !courses ||
        !available_hours ||
        !available_locations){
  
        resp.status(400).json({error: 'Missing some information!'})
        return
      }
    }

    const { db } = await connect()

    const response = await db.collection('users').insertOne({
      name,
      email,
      cellPhone,
      teacher,
      coins: 1,
      courses: courses || [],
      available_hours: available_hours || {},
      available_locations: available_locations || [],
      reviews: [],
      appointments: []
    })
    
    resp.status(201).json(response.ops[0])

  }else if(req.method === 'GET'){
    const {rid} = req.body
    const {db} = await connect()
    const id = new ObjectId(rid)

    if(!rid){
      resp.status(400).json({error: 'Invalid user id!'})
      return
    }

    const response = await db.collection('users').findOne({"_id": id})

    if(!response){
      resp.status(400).json({error: 'This user not existis!'})
      return
    }
    
    resp.status(200).json(response)
  }else{
    resp.status(400).json({error: 'this route is only to post requests!'})
  }
  
}