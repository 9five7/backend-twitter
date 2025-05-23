import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateTweetReqBody } from '~/models/requests/Tweets.requests'
export const createTweetController = async (req: Request<ParamsDictionary, any, CreateTweetReqBody>, res: Response) => {
  res.send('createTweetController')
}
