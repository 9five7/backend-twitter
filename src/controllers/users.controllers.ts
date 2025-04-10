import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/Users.requests'

import usersServices from '~/services/users.services'
// xử lý logic
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'admin' && password === 'admin') {
    return res.status(401).json({
      message: 'Username or password is incorrect'
    })
  }
  res.json({
    message: 'Login successfully'
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await usersServices.register(req.body)
    return res.json({
      message: 'register successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
