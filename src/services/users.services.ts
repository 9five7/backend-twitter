import User from '~/models/schemas/User.schemas'
import databaseServices from '~/services/database.services'

class UsersServices {
  async register(payload: { email: string; password: string }) {
    const result = await databaseServices.users.insertOne(
      new User({
        email: payload.email,
        password: payload.password
      })
    )
    return result
  }
}
const usersServices = new UsersServices()
export default usersServices
