import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import {
  ForgotPasswordReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  VerifyForgotPasswordReqBody
} from '~/models/requests/Users.requests'
import User from '~/models/schemas/User.schemas'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
// xử lý logic
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  // kiểm tra xem user có tồn tại hay không
  const result = await usersServices.login({ user_id: user_id.toString(), verify: user.verify })
  res.json({
    message: USER_MESSAGE.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersServices.register(req.body)
  res.json({
    message: USER_MESSAGE.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body

  const result = await usersServices.logout(refresh_token)
  res.json(result)
}
export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersServices.refreshToken(refresh_token)
  res.json({
    message: USER_MESSAGE.REFRESH_TOKEN_SUCCESS,
    result
  })
}
export const emailVerifyTokenController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  // nếu user không tồn tại thì trả về lỗi
  if (!user) {
    res.status(httpStatus.NOT_FOUND).json({ message: USER_MESSAGE.USER_NOT_FOUND })
    return
  }
  //đã verify rồi thì sẽ ko báo lỗi
  if (user.email_verify_token === '') {
    res.json({ message: USER_MESSAGE.EMAIL_VERIFY_BEFORE })
  }
  const result = await usersServices.verifyEmail(user_id)
  res.json({
    message: USER_MESSAGE.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const resendEmailVerifyTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  // nếu user không tồn tại thì trả về lỗi
  if (!user) {
    res.status(httpStatus.NOT_FOUND).json({ message: USER_MESSAGE.USER_NOT_FOUND })
    return
  }
  //đã verify rồi thì sẽ ko báo lỗi
  if (user.verify === UserVerifyStatus.Verified) {
    res.json({ message: USER_MESSAGE.EMAIL_VERIFY_BEFORE })
  }
  const result = await usersServices.resendEmailVerifyToken(user_id)
  res.json({
    message: USER_MESSAGE.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  const result = await usersServices.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  // nếu user không tồn tại thì trả về lỗi
  res.json({
    result
  })
}
export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: USER_MESSAGE.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersServices.resetPassword(user_id, password)
  res.json({
    result
  })
}
export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersServices.getMe(user_id)
  res.json({
    message: USER_MESSAGE.GET_ME_SUCCESS,
    result
  })
}
export const updateMeController = async (req: Request, res: Response, next: NextFunction) => {
  