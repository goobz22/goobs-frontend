// Import the database connection utility
import connectDb from '../../mongodb/utils/connectDb'

// Import the user model
import UserRegistration from '../../mongodb/user/model'

const userDatabase = {
  databaseConnectionUtility: connectDb,
  databaseUserModel: UserRegistration,
}

export default userDatabase
