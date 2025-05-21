import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '~/models/Other'

export interface CreateTweetReqBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}
