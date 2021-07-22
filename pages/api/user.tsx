import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../utils/database"

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

  if(req.method === 'POST'){
    const {name, email, cellPhone, teacher, courses, available_hours, available_locations} = req.body

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

    const response = await db.insertOne({
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
  }else{
    resp.status(400).json({error: 'this route is only to POST requests!'})
  }
  
}