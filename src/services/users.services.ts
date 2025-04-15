import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
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
      privateKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
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
      privateKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private signEmailVerifyToken = (user_id: string) => {
    return signToken({
      payload: {
        user_id,
        type: TokenType.VerifyEmailToken
      },
      privateKey: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.EMAIL_TOKEN_EXPIRES_IN
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
    const user_id = new ObjectId() // tạo id cho user
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString()) // tạo email_verify_token
    await databaseServices.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth), // chuyển đổi date_of_birth thành đối tượng Date
        password: hasPassword(payload.password) // mã hóa password
      })
    )

    const [access_Token, refresh_Token] = await this.signAccessTokenAndRefreshToken(user_id.toString()) // tạo access token và refresh token
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        // tạo refresh token
        user_id: new ObjectId(user_id),
        token: refresh_Token
      })
    )
    // tạo access token và refresh token
    return {
      access_Token,
      refresh_Token
    }
  }
  async checkEmailExists(email: string) {
    const user = await databaseServices.users.findOne({ email }) // kiểm tra xem email đã tồn tại hay chưa
    // nếu tồn tại thì trả về true
    return Boolean(user)
  }
  async login(user_id: string) {
    const [access_Token, refresh_Token] = await this.signAccessTokenAndRefreshToken(user_id)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        // tạo refresh token
        user_id: new ObjectId(user_id),
        token: refresh_Token
      })
    ) // tạo access token và refresh token
    return {
      access_Token,
      refresh_Token
    }
  }
  async logout(refresh_Token: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refresh_Token })
    return {
      message: USER_MESSAGE.LOGOUT_SUCCESS
    }
  }
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken(user_id), // tạo access token và refresh token
      await databaseServices.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify_status: UserVerifyStatus.Verified,
            updated_at: new Date()
          }
        }
      )
    ])
    // cập nhật email_verify_token thành rỗng
    const [access_Token, refresh_Token] = token // tạo access token và refresh token
    return {
      access_Token,
      refresh_Token
    }
  }
}
const usersServices = new UsersServices()
export default usersServices
