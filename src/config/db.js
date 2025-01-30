import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectDB() {

    try{
        await client.connect();
        db = client.db('task_managment');
        console.log('✅ Connected to MongoDB');
    }catch (error){
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
    
}


 export function getDB() {
    if (!db) {
      throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
  }