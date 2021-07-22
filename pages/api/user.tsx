import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../utils/database"

interface ErrorResponseType {
  error: string
}

interface IAvailableHours {
  monday: number[]
  tuesday: number[]
  wednesday: number[]
  thursday: number[]
  friday: number[]
}

interface SuccessResponseType {
  _id: string
  name: string
  email: string
  cellPhone: string
  teacher: true
  coins: number
  courses: string[]
  available_hours: IAvailableHours
  available_locations: string[]
  reviews: Record<string, unknown>[]
  appointments: Record<string, unknown>[]
}

export default async (
  req: NextApiRequest,
  resp: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

  if(req.method === 'POST'){

    const {
      name,
      email,
      cellPhone,
      teacher,
      courses,
      available_hours,
      available_locations
    }: {
      name: string
      email: string
      cellPhone: string
      teacher: boolean
      courses: string[]
      available_locations: string[]
      available_hours: IAvailableHours
    } = req.body

    // check if available hours is between 7:00 and 20:00
    let invalidHour = false
    for (const dayOfTheWeek in available_hours) {
      available_hours[dayOfTheWeek].forEach((hour) => {
        if (hour < 7 || hour > 20) {
          invalidHour = true
          return
        }
      })
    }
    if (invalidHour) {
      resp
        .status(400)
        .json({ error: 'You cannot teach between 20:00 and 7:00' })
      return
    }

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

    const lowerCaseEmail = email.toLowerCase()
    const emailAlreadyExists = await db.findOne({ email: lowerCaseEmail })
    if (emailAlreadyExists) {
      resp
        .status(400)
        .json({ error: `E-mail ${lowerCaseEmail} already registered!` })
      return
    }

    const response = await db.insertOne({
      name,
      email: lowerCaseEmail,
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
    resp.status(400).json({error: 'Wrong request method!'})
  }
  
}