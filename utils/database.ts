import {Collection, Db, MongoClient } from "mongodb"

interface ConnectType {
  db: Collection
  client: MongoClient
}

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export default async function connect(): Promise<ConnectType>{

  if(!client.isConnected()){await client.connect()}
  const db = client.db(process.env.DATABASE_COLLECTION).collection('users')

  return {db, client}
}