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
  async checkEmailExists(email: string) {
    const user = await databaseServices.users.findOne({ email })// kiểm tra xem email đã tồn tại hay chưa
    // nếu tồn tại thì trả về true
    return Boolean(user)
  }
}
const usersServices = new UsersServices()
export default usersServices
