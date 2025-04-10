import dotenv from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schemas'
dotenv.config()
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_USER_COLLECTION = process.env.DB_USER_COLLECTION

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@facebook.k35yp.mongodb.net/?retryWrites=true&w=majority&appName=Facebook`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(DB_NAME) // kết nối đến database nào
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 }) // kiểm tra kết nối
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
  }
  get users(): Collection<User> {
    return this.db.collection(DB_USER_COLLECTION as string) // trả về collection users
  }
}
// tạo object từ class DatabaseServices
const databaseServices = new DatabaseServices()
export default databaseServices
