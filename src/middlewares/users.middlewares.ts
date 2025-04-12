// middlewares xửa lý dữ liệu phần trung  gian cho người dùng ví dụ đăng nhập, đăng ký
// sẽ kiểm tra như validate dữ liệu đầu vào
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
import { hasPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
export const loginValidateUser = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseServices.users.findOne({
              email: value,
              password: hasPassword(req.body.password)
            }) // kiểm tra xem email đã tồn tại hay chưa
            if (!user) {
              throw new Error(USER_MESSAGE.LOGIN_FAILED)
            }
            req.user = user // gán user vào req để sử dụng trong controller
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGE.PASSWORD_STRONG
        },
        trim: true
      }
    },
    ['body']
    // ['body'] là nơi mà mình muốn validate dữ liệu)
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGE.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.NAME_MUST_BE_STRING
        },
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USER_MESSAGE.NAME_LENGTH
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExitEmail = await usersServices.checkEmailExists(value)
            if (isExitEmail) {
              throw new Error(USER_MESSAGE.EMAIL_IS_EXIST)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGE.PASSWORD_STRONG
        },
        trim: true
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRING
        },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGE.PASSWORD_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGE.CONFIRM_PASSWORD_IS_NOT_MATCH)
            }
            return true
          }
        },
        trim: true
      },
      date_of_birth: {
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: USER_MESSAGE.DATE_OF_BIRTH_IS_INVALID
        }
      }
    },
    ['body'] // ['body'] là nơi mà mình muốn validate dữ liệu)
  )
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: {
          errorMessage: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1] // lấy access token từ header
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                status: httpStatus.UNAUTHORIZED
              }) // nếu không có access token thì trả về lỗi
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token
              })
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: (error as JsonWebTokenError).message,
                status: httpStatus.UNAUTHORIZED
              })
            }
            return true // giải mã access token
          }
        }
      }
    },
    ['headers'] // ['headers'] là nơi mà mình muốn validate dữ liệu)
  )
)
// chect lần lượt có tồn tại refresh token hay không -> verifyToken-> check có trong db hay ko
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USER_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({
                  token: value
                }),
                databaseServices.refreshTokens.findOne({
                  token: value
                })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_OR_NOT_EXIST,
                  status: httpStatus.UNAUTHORIZED
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof ErrorWithStatus) {
                throw new ErrorWithStatus({
                  message: error.message,
                  status: httpStatus.UNAUTHORIZED
                })
              }
              throw error
            }

            return true
          }
        }
      }
    },
    ['body'] // ['body'] là nơi mà mình muốn validate dữ liệu)
  )
)
