import { Document, Types } from 'mongoose'

export interface UserRegistrationData extends Document {
  _id?: Types.ObjectId
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
  password?: string
  verifypassword?: string
  registrationToken?: string
  registered?: boolean
  registeredToken?: string
  registeredExpiration?: Date | null
  verifiedEmail?: boolean
  verifiedPhoneNumber?: boolean
  verifiedToken?: string
  verifiedExpiration?: Date | null
  loggedIn?: boolean
  loggedInToken?: string
  loggedInExpiration?: Date | null
  verificationCode?: string
}
