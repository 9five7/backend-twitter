import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors'
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/Users.requests'
import Follower from '~/models/schemas/Follower.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

import User from '~/models/schemas/User.schemas'
import databaseServices from '~/services/database.services'
import { hasPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
config()
class UsersServices {
  private signAccessToken = ({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) => {
    return signToken({
      payload: {
        user_id,
        type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  } // tạo access token
  private signRefreshToken = ({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) => {
    return signToken({
      payload: {
        user_id,
        type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  } // tạo refresh token
  private signEmailVerifyToken = ({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) => {
    return signToken({
      payload: {
        user_id,
        type: TokenType.VerifyEmailToken,
        verify
      },
      privateKey: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.EMAIL_TOKEN_EXPIRES_IN
      }
    })
  } // tạo email_verify_token
  private signForgotPasswordToken = ({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) => {
    return signToken({
      payload: {
        user_id,
        type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccessTokenAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify }), // tạo access token
      this.signRefreshToken({ user_id, verify }) // tạo refresh token
    ])
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId() // tạo id cho user
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    }) // tạo email_verify_token
    await databaseServices.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `user${user_id.toString()}`,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth), // chuyển đổi date_of_birth thành đối tượng Date
        password: hasPassword(payload.password) // mã hóa password
      })
    )

    const [access_Token, refresh_Token] = await this.signAccessTokenAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    }) // tạo access token và refresh token
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
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_Token, refresh_Token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      verify
    })
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
  async refreshToken(refresh_Token: string) {
    // 1. Tìm token trong DB
    const foundToken = await databaseServices.refreshTokens.findOne({ token: refresh_Token })
    if (!foundToken) {
      return {
        message: USER_MESSAGE.REFRESH_TOKEN_NOT_FOUND
      }
    }
    const user_id = foundToken.user_id.toString()
    // 2. Tạo access token và refresh token moi
    // 2. Xoá refresh token cũ
    await databaseServices.refreshTokens.deleteOne({ token: refresh_Token })
    // 3. Tạo access token và refresh token mới
    const [access_Token, new_refresh_Token] = await this.signAccessTokenAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    // 4. Lưu refresh token mới vào DB
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_Token
      })
    )
    // 5. Trả về token mới
    return {
      access_Token,
      refresh_Token: new_refresh_Token
    }
  }
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }), // tạo access token và refresh token
      await databaseServices.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
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
  async resendEmailVerifyToken(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified }) // tạo email_verify_token
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token,
          updated_at: new Date()
        }
      }
    )
    return {
      message: USER_MESSAGE.RESEND_EMAIL_VERIFY_TOKEN_SUCCESS
    }
  }
  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify }) // tạo forgot_password_token
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token,
          updated_at: new Date()
        }
      }
    )
    return {
      message: USER_MESSAGE.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }
  async resetPassword(user_id: string, password: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hasPassword(password),
          updated_at: new Date()
        }
      }
    )
    return {
      message: USER_MESSAGE.USER_PASSWORD_RESET_SUCCESS
    }
  }
  async getMe(user_id: string) {
    const user = await databaseServices.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        } // không trả về password, email_verify_token, forgot_password_token
      }
    )
    return {
      user
    }
  }
  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseServices.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        },
        returnDocument: 'after'
      }
    )

    return user
  }
  async getProfile(username: string) {
    const user = await databaseServices.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0
        } // không trả về password, email_verify_token, forgot_password_token
      }
    )
    if (user === null) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.USER_NOT_FOUND,
        status: httpStatus.NOT_FOUND
      })
    }
    return {
      user
    }
  }
  async follow(user_id: string, followed_user_id: string) {
    const follower = await databaseServices.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (follower === null) {
      await databaseServices.followers.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
      return {
        message: USER_MESSAGE.FOLLOW_SUCCESS
      }
    }
    return {
      message: USER_MESSAGE.FOLLOWED
    }
  }
  async unfollow(user_id: string, followed_user_id: string) {
    const follower = await databaseServices.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (follower !== null) {
      await databaseServices.followers.deleteOne({
        user_id: new ObjectId(user_id),
        followed_user_id: new ObjectId(followed_user_id)
      })
      return {
        message: USER_MESSAGE.ALREADY_UNFOLLOWED
      }
    }
    return {
      message: USER_MESSAGE.UNFOLLOW_SUCCESS
    }
  }
  async changePassword(user_id: string, new_password: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hasPassword(new_password),
          updated_at: new Date()
        }
      }
    )
    return {
      message: USER_MESSAGE.CHANGE_PASSWORD_SUCCESS
    }
  }
}
const usersServices = new UsersServices()
export default usersServices
