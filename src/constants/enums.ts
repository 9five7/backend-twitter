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
