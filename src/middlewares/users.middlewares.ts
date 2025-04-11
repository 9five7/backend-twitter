// middlewares xửa lý dữ liệu phần trung  gian cho người dùng ví dụ đăng nhập, đăng ký
// sẽ kiểm tra như validate dữ liệu đầu vào
import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { USER_MESSAGE } from '~/constants/message'
import usersServices from '~/services/users.services'
import { validate } from '~/utils/validation'
export const loginValidateUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    })
  }
  next()
}
export const registerValidator = validate(
  checkSchema({
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
  })
)
