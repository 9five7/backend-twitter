import { config } from 'dotenv'
import { createHash } from 'node:crypto'
config()
export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}
export function hasPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}
