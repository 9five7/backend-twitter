import 'express'
import { TokenPayload } from '~/models/requests/Users.requests'
import User from '~/models/schemas/User.schemas'
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
