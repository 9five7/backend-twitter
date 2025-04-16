import { Router } from 'express'
import {
  emailVerifyTokenController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidateUser,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()
/**
 * description: login user
 * path:/login
 * method: POST
 * request body: { email: string; password: string }
 */
usersRouter.post('/login', loginValidateUser, wrapAsync(loginController))
/**
 * description: register user
 * path:/register
 * method: POST
 * request body: { email: string; password: string ;name: string ;confirm_password: string; date_of_birth:ISO08601 }
 */
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
/**
 * description: logout user
 * path:/logout
 *  method: POST
 * headers: { authorization: Bearer <token> }
 *  body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
/**
 * description: verify email 
 * path:/verify-email
 *  method: POST
 *  body: {verify-email:string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))
usersRouter.post('/refresh-token', accessTokenValidator, refreshTokenValidator, wrapAsync(refreshTokenController))
/**
 * description: verify email 
 * path:/verify-email
 *  method: POST
 *  body: {verify-email:string }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyTokenController))
export default usersRouter
