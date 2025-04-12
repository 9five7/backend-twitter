import { JwtPayload } from 'jsonwebtoken'

export interface RegisterReqBody {
  email: string
  password: string
  name: string
  confirm_password: string
  date_of_birth: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: string
}
