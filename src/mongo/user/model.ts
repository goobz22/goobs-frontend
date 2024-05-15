import mongoose from 'mongoose'
import { UserRegistrationData } from '../../types/user' // Import the interface

const Schema = mongoose.Schema

const userRegistrationSchema = new Schema<UserRegistrationData>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phoneNumber: { type: String, required: false, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    registered: { type: Boolean, required: false, index: true },
    registeredToken: { type: String, required: false, index: true },
    registeredExpiration: { type: Date, required: false, index: true },
    verifiedEmail: { type: Boolean, required: false, index: true },
    verifiedPhoneNumber: { type: Boolean, required: false, index: true },
    verifiedToken: { type: String, required: false, index: true },
    verifiedExpiration: { type: Date, required: false, index: true },
    loggedIn: { type: Boolean, required: false, index: true },
    loggedInToken: { type: String, required: false, index: true },
    loggedInExpiration: { type: Date, required: false, index: true },
  },
  {
    versionKey: '__v',
    optimisticConcurrency: true,
  }
)

const userRegistrationModel: mongoose.Model<UserRegistrationData> =
  mongoose.models.UserRegistration ||
  mongoose.model<UserRegistrationData>(
    'UserRegistration',
    userRegistrationSchema
  )

export default userRegistrationModel
