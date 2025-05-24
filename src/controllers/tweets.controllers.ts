import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateTweetReqBody } from '~/models/requests/Tweets.requests'
import { TokenPayload } from '~/models/requests/Users.requests'
import tweetsServices from '~/services/tweet.services'
export const createTweetController = async (req: Request<ParamsDictionary, any, CreateTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsServices.createTweet(user_id, req.body)
  res.json({
    result,
    message: 'create tweet success'
  })
}
