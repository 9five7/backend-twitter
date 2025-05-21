import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const tweetsRouter = Router()
/**
 * description: create tweet
 * path:/
 * method: POST
 * request body: TweestReqBody
 */
tweetsRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapAsync(createTweetController))

export default tweetsRouter