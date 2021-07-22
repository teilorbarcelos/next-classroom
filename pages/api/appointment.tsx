import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from 'next-auth/client'
import connect from "../../utils/database"
import { ObjectId } from "mongodb"

interface ErrorResponseType {
    error: string
}

interface MessageResponseType {
    message: string
}

interface User {
    _id: string
    name: string
    email: string
    cellPhone: string
    teacher: boolean
    coins: number
    courses: string[]
    available_hours: Record<string, number[]>
    available_locations: string[]
    reviews: Record<string, unknown>[]
    appointments: {
        date: string
    }[]
}

interface SuccessResponseType {
  date: string
  teacher_name: string
  teacher_id: string
  student_name: string
  student_id: string
  course: string
  location: string
  appointment_link: string
}

export default async (
    req: NextApiRequest,
    resp: NextApiResponse<ErrorResponseType | MessageResponseType | SuccessResponseType>
): Promise<void> => {

    if (req.method === 'PUT') {

        const session = await getSession({ req })
    
        if (!session) {
            resp.status(400).json({ error: 'Please login first!' })
            return
        }

        const {
            date,
            teacher_id,
            student_email,
            course,
            location,
            appointment_link
        }: {
            date: string
            teacher_id: string
            student_email: string
            course: string
            location: string
            appointment_link: string
          } = req.body

        if (!date ||
            !teacher_id ||
            !student_email ||
            !course ||
            !location) {

            resp.status(400).json({ error: 'Missing some information!' })
            return

        }

        try {
            new ObjectId(teacher_id)
        } catch {
            resp.status(400).json({ error: 'Wrong teacher ID' })
            return
        }

        const parsedDate = new Date(date)
        const now = new Date()
        const auxParsedDate = new Date(date)
    
        // check if requested date is on the past
        if (auxParsedDate.setHours(0, 0, 0, 0) <= now.setHours(0, 0, 0, 0)) {
          resp.status(400).json({
            error: "You can't create appointments on the past",
          })
          return
        }

        const { db } = await connect()

        const teacherExists = await db.findOne({ _id: new ObjectId(teacher_id) })
        const studentExists = await db.findOne({ email: student_email })

        if (!teacherExists) {
            resp.status(400).json({ error: `Teacher with ID ${teacher_id} does not exist!` })
            return
        }

        if (!studentExists) {
            resp.status(400).json({ error: `Student with email ${student_email} does not exist!` })
            return
        }

        // check if teacher and student are the same person
        if (student_email === teacherExists.email) {
          resp
            .status(400)
            .json({ error: 'You cannot create an appointment with yourself' })
          return
        }
    
        // check if student have enough coins
        if (studentExists.coins === 0) {
          resp.status(400).json({
            error: `Student ${studentExists.name} does not have enough coins`,
          })
          return
        }
    
        // check if requested day/hour is available for the teacher
        const weekdays = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ]
        const requestedDay = weekdays[parsedDate.getDay()]
        const requestedHour = parsedDate.getUTCHours() - 3
        if (!teacherExists.available_hours[requestedDay]?.includes(requestedHour)) {
          resp.status(400).json({
            error: `Teacher ${teacherExists.name} is not available at ${requestedDay} ${requestedHour}:00`,
          })
          return
        }
    
        // check if teacher already have an appointment on the requested day of the month
        teacherExists.appointments.forEach((appointment) => {
          const appointmentDate = new Date(appointment.date)
    
          if (appointmentDate.getTime() === parsedDate.getTime()) {
            resp.status(400).json({
              error: `Teacher ${
                teacherExists.name
              } already have an appointment at ${appointmentDate.getDate()}/${
                appointmentDate.getMonth() + 1
              }/${appointmentDate.getFullYear()} ${
                appointmentDate.getUTCHours() - 3
              }:00`,
            })
            return
          }
        })

        const appointment = {
            date,
            teacher_name: teacherExists.name,
            teacher_email: teacherExists.email,
            teacher_id,
            student_name: studentExists.name,
            student_id: studentExists._id,
            course,
            location,
            appointment_link: appointment_link || '',
        }

        await db.updateOne({ _id: new ObjectId(teacher_id) }, { $push: { appointments: appointment }, $inc: { coins: 1 } })
        await db.updateOne({ email: student_email }, { $push: { appointments: appointment }, $inc: { coins: -1 } })

        resp.status(204).json(appointment)

    } else {
        resp.status(400).json({ error: 'this route is only to POST requests!' })
    }

}