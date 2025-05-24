import { ObjectId } from 'mongodb'
import { CreateTweetReqBody } from '~/models/requests/Tweets.requests'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseServices from '~/services/database.services'

class TweetsService {
  async checkAndCreateHashtag(hashtags: string[]) {
    // tìm hashtag trong DB, neu không tìm thấy thì tạo mới
    const hashtagDocument = await Promise.all(
      hashtags.map((hashtag) => {
        return databaseServices.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
      })
    )
    return hashtagDocument.map((hashtag) => hashtag?._id)
  }
  async createTweet(user_id: string, body: CreateTweetReqBody) {
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    // console.log(hashtags)
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
    const tweet = await databaseServices.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}
const tweetsServices = new TweetsService()
export default tweetsServices
