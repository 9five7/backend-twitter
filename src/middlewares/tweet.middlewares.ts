import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import { TWEETS_MESSAGE } from '~/constants/message'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'
const tweetType = numberEnumToArray(TweetType)
const tweetAudience = numberEnumToArray(TweetAudience)
const mediaType = numberEnumToArray(MediaType)
export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [tweetType],
        errorMessage: TWEETS_MESSAGE.TYPE_IS_INVALID
      }
    },
    audience: {
      isIn: {
        options: [tweetAudience],
        errorMessage: TWEETS_MESSAGE.AUDIENCE_IS_INVALID
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          //nếu type là retweet,comment,quotetweet thì parent_id phải là tweet_id của tweet cha
          if ([TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_TWEET_ID)
          }
          // nếu type là tweet thì parent_id phải la null
          if (type === TweetType.Tweet && value) {
            throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_NULL)
          }
          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]
          //nếu type là comment , quotetweet,tweet và không có hashtags,mentions thì content phải là string và khác rong
          if (
            [TweetType.Tweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            value === ''
          ) {
            throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
          }
          // nếu type là Retweet thì content phải là `''`
          if (type === TweetType.Retweet && value !== '') {
            throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_EMPTY_STRING)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // yêu cầu mỗi phần tử của array phải là string
          if (!value.every((item: any) => typeof item === 'string')) {
            throw new Error(TWEETS_MESSAGE.HASHTAGS_MUST_BE_ARRAY_OF_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // yêu cầu mỗi phần tử của array phải là user_id
          if (!value.every((item: any) => ObjectId.isValid(item))) {
            throw new Error(TWEETS_MESSAGE.MENTIONS_MUST_BE_ARRAY_OF_USER_ID)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // yêu cầu mỗi phần tử của array phải là medias Object
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !mediaType.includes(item.type)
            })
          ) {
            throw new Error(TWEETS_MESSAGE.MEDIAS_MUST_BE_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    }
  })
)
