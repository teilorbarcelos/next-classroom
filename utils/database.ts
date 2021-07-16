import { Db, MongoClient } from "mongodb"

interface ConnectType {
  db: Db
  client: MongoClient
}

const client = new MongoClient(process.env.DATABASE_URL)

export default async function connect(): Promise<ConnectType>{

  // try {
  //   await client.connect();
  //   await client.db("nextclassroom").command({ ping: 1 });
  //   console.log("Connected successfully to server");
  // } finally {
  //   await client.close();
  // }
  // if(!client.isConnected()){await client.connect()}

  await client.connect()
  const db = client.db('nextclassroom')
  return {db, client}
}