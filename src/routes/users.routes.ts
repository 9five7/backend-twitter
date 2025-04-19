import { Router } from 'express'
import {
  emailVerifyTokenController,
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyTokenController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidateUser,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/Users.requests'
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

/**
 * description:verify forgot password
 * path:/verify-forgot-password
 *  method: POST
 *  body: {verify-forgot-password:string }
 */
usersRouter.post('/verify-forgot-password', verifyForgotPasswordValidator, wrapAsync(verifyForgotPasswordController))
/**
 * description: reset password
 * path:/reset-password
 *  method: POST
 *  body: {forgot-password:string ,password:string, confirm_password:string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))
/**
 * description: get profile
 * path:/me
 *  method: GET
 *  body: {authorization:Bearer<access_token>}
 */
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))
/**
 * description: updated my profile
 * path:/me
 *  method: PATCH
 *  body: {authorization:Bearer<access_token>}
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapAsync(updateMeController)
)
export default usersRouter
