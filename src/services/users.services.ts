import { TokenType } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/Users.requests'

import User from '~/models/schemas/User.schemas'
import databaseServices from '~/services/database.services'
import { hasPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class UsersServices {
  private signAccessToken = (user_id: string) => {
    return signToken({
      payload: {
        user_id,
        type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken = (user_id: string) => {
    return signToken({
      payload: {
        user_id,
        type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async register(payload: RegisterReqBody) {
    const result = await databaseServices.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth), // chuyển đổi date_of_birth thành đối tượng Date
        password: hasPassword(payload.password) // mã hóa password
      })
    )
    const user_id = result.insertedId.toString() // lấy id của user vừa tạo
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id), // tạo access token
      this.signRefreshToken(user_id) // tạo refresh token
    ])
    return {
      accessToken,
      refreshToken
    }
  }
  async checkEmailExists(email: string) {
    const user = await databaseServices.users.findOne({ email }) // kiểm tra xem email đã tồn tại hay chưa
    // nếu tồn tại thì trả về true
    return Boolean(user)
  }
}
const usersServices = new UsersServices()
export default usersServices
