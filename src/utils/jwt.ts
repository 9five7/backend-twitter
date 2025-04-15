import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/Users.requests'
config()
export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    return jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}
export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
