import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/Users.requests'
import User from '~/models/schemas/User.schemas'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
// xử lý logic
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  // kiểm tra xem user có tồn tại hay không
  const result = await usersServices.login(user_id.toString())
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
