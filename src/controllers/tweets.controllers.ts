import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateTweetReqBody } from '~/models/requests/Tweets.requests'
export const createTweetController = async (
  req: Request<ParamsDictionary, any, CreateTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({ message: 'Create tweet successfully' })
}
