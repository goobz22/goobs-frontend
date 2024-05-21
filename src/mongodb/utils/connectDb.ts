import { config } from 'dotenv'
import mongoose, { ConnectOptions, Mongoose } from 'mongoose'

config({ path: ['.env.local', '.env'] })

const connectDb = async (
  maxRetries = 5,
  retryDelay = 1000
): Promise<Mongoose> => {
  let retries = 0

  while (retries < maxRetries) {
    try {
      const MONGO_URI = process.env.MONGODB_URI || ''

      if (!MONGO_URI) {
        throw new Error('Please define the MONGO_URI environment variable.')
      }

      const options: ConnectOptions = {
        bufferCommands: false,
        autoCreate: true,
      }

      const mongooseInstance = await mongoose.connect(MONGO_URI, options)

      console.log('Connected to MongoDB')
      return mongooseInstance
    } catch (error) {
      retries++
      console.error(`Error connecting to MongoDB (attempt ${retries}):`, error)

      if (retries < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      } else {
        throw error
      }
    }
  }

  throw new Error('Max retries exceeded. Unable to connect to MongoDB.')
}

export default connectDb
