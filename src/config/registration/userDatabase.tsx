// Import the database connection utility
import connectDb from '../../functions/mongo/connectDb'

// Import the user model
import UserRegistration from '../../mongo/user/model'

const userDatabase = {
  databaseConnectionUtility: connectDb,
  databaseUserModel: UserRegistration,
}

export default userDatabase
