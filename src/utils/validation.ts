import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import httpStatus from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validation.run(req)
    const errors = validationResult(req)
    // không có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }

    const ErrorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in ErrorObject) {
      const { msg } = ErrorObject[key]
      // trả về lỗi không phải lỗi do validate
      if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = ErrorObject[key].msg
    }
    // nếu không  lỗi thì next
    next(entityError)
  }
}
