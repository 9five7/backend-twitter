import { ObjectId } from 'mongodb'
import { CreateTweetReqBody } from '~/models/requests/Tweets.requests'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseServices from '~/services/database.services'

class TweetsService {
  async createTweet(user_id: string, body: CreateTweetReqBody) {
    const result = await databaseServices.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [],
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet=await databaseServices.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}
const tweetsServices = new TweetsService()
export default tweetsServices
