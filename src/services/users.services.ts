import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enums'
import { USER_MESSAGE } from '~/constants/message'
import { RegisterReqBody } from '~/models/requests/Users.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

import User from '~/models/schemas/User.schemas'
import databaseServices from '~/services/database.services'
import { hasPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
config()
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
  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([
      this.signAccessToken(user_id), // tạo access token
      this.signRefreshToken(user_id) // tạo refresh token
    ])
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
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(user_id)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        // tạo refresh token
        user_id: new ObjectId(user_id),
        token: refreshToken
      })
    )
    // tạo access token và refresh token
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
  async login(user_id: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(user_id)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        // tạo refresh token
        user_id: new ObjectId(user_id),
        token: refreshToken
      })
    ) // tạo access token và refresh token
    return {
      accessToken,
      refreshToken
    }
  }
  async logout(refresh_token: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USER_MESSAGE.LOGOUT_SUCCESS
    } // xóa refresh token
  }
}
const usersServices = new UsersServices()
export default usersServices
