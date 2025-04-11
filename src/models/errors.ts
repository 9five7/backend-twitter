import httpStatus from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'

type ErrorsType = Record<string, { msg: string; [key: string]: any }>
export class ErrorWithStatus {
  status: number
  message: string
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}
export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = USER_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: httpStatus.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
