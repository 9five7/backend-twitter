export enum UserVerifyStatus {
  Unverified, // chưa xác thực
  Verified, // đã xác thực
  Banned // bị khoá
}
export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  VerifyEmailToken
}
export enum MediaType {
  Image,
  Video
}
export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}
export enum TweetAudience {
  Everyone, //0
  TwitterCircle //1
}
