import { Request, Response } from 'express'
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
export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersServices.register({
      email,
      password
    })
    return res.json({
      message: 'register successfully',
      result
    })
  } catch (error) {
    return res.status(500).json({
      message: 'register failed'
    })
  }
}
