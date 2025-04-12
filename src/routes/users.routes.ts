import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidateUser, registerValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidateUser, wrapAsync(loginController))
/**
 * description: register user
 * path:/register
 * method: POST
 * request body: { email: string; password: string ;name: string ;confirm_password: string; date_of_birth:ISO08601 }
 */
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
export default usersRouter
