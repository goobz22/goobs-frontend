'use server'
import userDatabase from '@/config/registration/userDatabase'
import { UserRegistrationData } from '@/types/user'
import crypto from 'crypto'
import { FilterQuery } from 'mongoose'

const { databaseConnectionUtility, databaseUserModel } = userDatabase

export default async function getUser(
  identifier:
    | {
        email: UserRegistrationData['email']
        password?: UserRegistrationData['password']
      }
    | { loggedInToken: UserRegistrationData['loggedInToken'] },
  ...fields: (keyof UserRegistrationData)[]
): Promise<Partial<UserRegistrationData> | null> {
  if (!identifier) {
    console.log('No identifier provided. Fetching user halted.')
    return null
  }

  try {
    await databaseConnectionUtility()
    const User = databaseUserModel
    const projection = fields.reduce(
      (acc, field) => {
        acc[field] = 1
        return acc
      },
      {} as Record<keyof UserRegistrationData, 1>
    )

    let query: FilterQuery<UserRegistrationData>
    let checkPassword = false

    if ('email' in identifier) {
      console.log('Fetching user from the database by email.')
      query = { email: identifier.email }
      projection.email = 1 // Include the email field in the projection
      if ('password' in identifier && identifier.password) {
        console.log('Fetching user from the database by email and password.')
        checkPassword = true
        projection.password = 1 // Include the password field in the projection
      }
    } else if ('loggedInToken' in identifier) {
      console.log('Fetching user from the database by loggedInToken.')
      query = { loggedInToken: identifier.loggedInToken }
      // Include all fields in the projection for loggedInToken query
      Object.keys(projection).forEach(field => {
        projection[field as keyof UserRegistrationData] = 1
      })
    } else {
      console.log('Invalid identifier provided. Fetching user halted.')
      return null
    }

    const user = await User.findOne(query, projection)
    if (!user) {
      console.log('User not found.')
      return null
    }

    if (checkPassword && user.password) {
      const [salt, hashedPassword] = user.password.split(':')
      const providedPassword =
        'password' in identifier && identifier.password
          ? crypto
              .pbkdf2Sync(identifier.password, salt, 1000, 64, 'sha512')
              .toString('hex')
          : undefined
      if (providedPassword !== hashedPassword) {
        console.log('Password does not match.')
        return null
      }
    }

    // Correctly handle null values to comply with TypeScript types
    const result = fields.reduce((acc, field) => {
      const fieldValue = user.get(field)
      acc[field] = fieldValue as UserRegistrationData[typeof field] | undefined // Type assertion
      return acc
    }, {} as Partial<UserRegistrationData>)

    return result
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}
