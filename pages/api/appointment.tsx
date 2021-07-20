import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../utils/database"
import {ObjectId} from "mongodb"

interface ErrorResponseType {
  error: string
}

interface MessageResponseType {
    message: string
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
  resp: NextApiResponse<ErrorResponseType | MessageResponseType | SuccessResponseType>
):Promise<void> => {

  if(req.method === 'PUT'){
    const {
        date,
        teacher_name,
        teacher_id,
        student_name,
        student_id,
        course,
        location,
        appointment_link
    } = req.body

    if(!date ||
        !teacher_name ||
        !teacher_id ||
        !student_name ||
        !student_id ||
        !course ||
        !location){

        resp.status(400).json({error: 'Missing some information!'})
        return

    }

    const { db } = await connect()

    const teacherExists = await db.collection('users').findOne({_id: new ObjectId(teacher_id)})
    const studentExists = await db.collection('users').findOne({_id: new ObjectId(student_id)})

    if(!teacherExists){
        resp.status(400).json({error: `Teacher ${teacher_name} with ID ${teacher_id} does not exist!`})
        return
    }

    if(!studentExists){
        resp.status(400).json({error: `Student ${student_name} with ID ${student_id} does not exist!`})
        return
    }

    const appointment = {
        date,
        teacher_name,
        teacher_id,
        student_name,
        student_id,
        course,
        location,
        appointment_link: appointment_link || ''
    }

    // await db.collection('users').updateMany({_id: new ObjectId(student_id)}, {$push: {appointments: appointment}})
    await db.collection('users').updateOne({_id: new ObjectId(teacher_id)}, {$push: {appointments: appointment}})
    await db.collection('users').updateOne({_id: new ObjectId(student_id)}, {$push: {appointments: appointment}})

    // const response = await db.collection('appointments').insertOne(appointment)
    
    resp.status(204).json({message: 'Appointment created successfuly!'})

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