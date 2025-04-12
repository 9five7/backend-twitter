import { Router } from 'express'
import { access } from 'fs'
import { loginController, registerController } from '~/controllers/users.controllers'
import { accessTokenValidator, loginValidateUser, registerValidator } from '~/middlewares/users.middlewares'
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
usersRouter.post('/logout',accessTokenValidator, wrapAsync(logoutController))
usersRouter.post('/refresh-token')

export default usersRouter
