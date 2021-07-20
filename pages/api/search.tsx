import { NextApiRequest, NextApiResponse } from "next"
import connect from "../../utils/database"

interface ErrorResponseType {
  error: string
}

export default async (
  req: NextApiRequest,
  resp: NextApiResponse<ErrorResponseType | object[]>
):Promise<void> => {

  if(req.method === 'GET'){
    const {courses} = req.body
    const {db} = await connect()

    if(!courses){
      resp.status(400).json({error: 'Invalid course name!'})
      return
    }
    

    const response = await db.collection('users').find({courses}).toArray()

    if(response.length == 0){
      resp.status(400).json({error: 'Your search returned no result!'})
      return
    }
    
    resp.status(200).json(response)
  }else{
    resp.status(400).json({error: 'this route is only to POST requests!'})
  }
  
}