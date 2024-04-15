'use server'
import userDatabase from '@/config/registration/userDatabase'
import { UserRegistrationData } from '@/types/user'
import crypto from 'crypto'

const { databaseConnectionUtility, databaseUserModel } = userDatabase

export default async function updateUser(
  identifier:
    | {
        email: UserRegistrationData['email']
        password: UserRegistrationData['password']
      }
    | { loggedInToken: UserRegistrationData['loggedInToken'] },
  updatedData: Partial<UserRegistrationData>
) {
  if (!identifier) {
    console.error('No identifier provided. Update aborted.')
    return
  }

  try {
    await databaseConnectionUtility() // Ensure DB connection is established
    const User = databaseUserModel
    console.log('Checking if a user exists...')

    // Dynamically build the query based on identifier type
    let query: { email: string } | { loggedInToken: string }
    if ('email' in identifier && 'password' in identifier) {
      query = { email: identifier.email as string }
    } else if ('loggedInToken' in identifier) {
      query = { loggedInToken: identifier.loggedInToken as string }
      console.log('Using loggedInToken as identifier:', identifier)
    } else {
      console.error('Invalid identifier provided. Update aborted.')
      return
    }

    const existingUser = await User.findOne(query)
    if (existingUser) {
      console.log('User found, proceeding with update...')
      // Check if the password field is being updated
      if (updatedData.password) {
        // Hash the password using crypto
        const salt = crypto.randomBytes(16).toString('hex')
        const hashedPassword = crypto
          .pbkdf2Sync(updatedData.password, salt, 1000, 64, 'sha512')
          .toString('hex')
        updatedData.password = `${salt}:${hashedPassword}`
        console.log('Password hashed successfully.')
      }
      // Log the fields being updated
      console.log('Fields being updated:', updatedData)
      // Update the user document with the provided updatedData
      await User.updateOne(query, { $set: updatedData })
      console.log('User updated successfully.')
    } else {
      console.log(
        'User not found. Checking if email and password are provided for creation...'
      )
      if ('email' in identifier && 'password' in identifier) {
        console.log('Email and password provided. Creating a new user...')
        const newUser = {
          email: identifier.email,
          ...updatedData,
        }
        // Hash the password using crypto
        if (identifier.password) {
          const salt = crypto.randomBytes(16).toString('hex')
          const hashedPassword = crypto
            .pbkdf2Sync(identifier.password, salt, 1000, 64, 'sha512')
            .toString('hex')
          newUser.password = `${salt}:${hashedPassword}`
        }
        await User.create(newUser)
        console.log('New user created successfully.')
      } else {
        console.error(
          'User not found and email and password not provided. Creation aborted.'
        )
      }
    }
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
